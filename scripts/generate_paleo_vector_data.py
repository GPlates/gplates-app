#!/usr/bin/env python3

import os
import numpy as np
from shapely.geometry import Polygon, LineString
import geopandas as gpd

os.environ["DISABLE_GPLATELY_DEV_WARNING"] = "true"

import gplately, pygplates

OUTPUT_DIR = "./paleo-vector-data"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


def generate_plate_boundaries(plot_topologies_obj, time):
    """Generate plate boundary polylines and save as shapefile."""
    print(f"Generating plate boundaries for {time} Ma...")
    plate_boundary_polygons = []
    for feature in plot_topologies_obj.topological_plate_boundaries:
        plate_boundary_polygons.extend(feature.get_all_geometries())
    shapely_polylines = []
    for geom in plate_boundary_polygons:
        if geom.get_number_of_interior_rings():
            print("Warning: skipping interior rings (holes) in the polygon. ")

        shapely_polylines.append(
            Polygon(
                np.array(
                    [j.to_lat_lon()[::-1] for j in geom.get_exterior_ring_points()]
                )
            ).boundary
        )
    wrapper = pygplates.DateLineWrapper(central_meridian=0.0)
    wrapped_plate_boundary_polylines = []
    for line in shapely_polylines:
        x_coords, y_coords = line.coords.xy
        x_list = list(x_coords)
        y_list = list(y_coords)
        wrapped = wrapper.wrap(
            pygplates.PolylineOnSphere(zip(y_list, x_list)), tessellate_degrees=0.1
        )
        for line in wrapped:
            wrapped_plate_boundary_polylines.append(
                LineString(np.array([j.to_lat_lon()[::-1] for j in line.get_points()]))
            )
    output_path = f"{OUTPUT_DIR}/plate_boundaries"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    gpd.GeoDataFrame(
        {
            "id": list(range(len(wrapped_plate_boundary_polylines)))
        },  # attributes (must be a list)
        geometry=wrapped_plate_boundary_polylines,
        crs="EPSG:4326",  # IMPORTANT: define CRS
    ).to_file(f"{output_path}/plate_boundaries-{time}-Ma.shp", driver="ESRI Shapefile")


def generate_coastlines(plot_topologies_obj, time):
    """Generate coastline polylines and save as shapefile."""
    print(f"Generating coastlines for {time} Ma...")
    coastline_polygons = []
    shapely_polylines = []
    for feature in plot_topologies_obj.coastlines:
        geom = feature.get_reconstructed_geometry()
        if isinstance(geom, pygplates.PolygonOnSphere):
            coastline_polygons.append(geom)
        elif isinstance(geom, pygplates.PolylineOnSphere):
            shapely_polylines.append(
                LineString(np.array([j.to_lat_lon()[::-1] for j in geom.get_points()]))
            )
        else:
            print(
                f"Warning: skipping geometry of type {type(geom)} for feature {feature.get_feature_id()}. "
            )

    for geom in coastline_polygons:
        if geom.get_number_of_interior_rings():
            print("Warning: skipping interior rings (holes) in the polygon. ")

        shapely_polylines.append(
            Polygon(
                np.array(
                    [j.to_lat_lon()[::-1] for j in geom.get_exterior_ring_points()]
                )
            ).boundary
        )
    wrapper = pygplates.DateLineWrapper(central_meridian=0.0)
    wrapped_coastline_polylines = []
    for line in shapely_polylines:
        x_coords, y_coords = line.coords.xy
        x_list = list(x_coords)
        y_list = list(y_coords)
        wrapped = wrapper.wrap(pygplates.PolylineOnSphere(zip(y_list, x_list)))
        for line in wrapped:
            wrapped_coastline_polylines.append(
                LineString(np.array([j.to_lat_lon()[::-1] for j in line.get_points()]))
            )
    output_path = f"{OUTPUT_DIR}/coastlines"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    gpd.GeoDataFrame(
        {
            "id": list(range(len(wrapped_coastline_polylines)))
        },  # attributes (must be a list)
        geometry=wrapped_coastline_polylines,
        crs="EPSG:4326",  # IMPORTANT: define CRS
    ).to_file(f"{output_path}/coastlines-{time}-Ma.shp", driver="ESRI Shapefile")


def generate_subduction_lines(plot_topologies_obj, time):
    """Generate subduction polylines and save as shapefile."""
    print(f"Generating subduction lines for {time} Ma...")
    shapely_polylines = []
    for feature in plot_topologies_obj.trench_left:
        for geom in feature.get_all_geometries():
            shapely_polylines.append(
                LineString(np.array([j.to_lat_lon()[::-1] for j in geom.get_points()]))
            )
    for feature in plot_topologies_obj.trench_right:
        for geom in feature.get_all_geometries():
            shapely_polylines.append(
                LineString(
                    np.array([j.to_lat_lon()[::-1] for j in geom.get_points()])[::-1]
                )
            )

    wrapper = pygplates.DateLineWrapper(central_meridian=0.0)
    wrapped_subduction_polylines = []
    for line in shapely_polylines:
        x_coords, y_coords = line.coords.xy
        x_list = list(x_coords)
        y_list = list(y_coords)
        wrapped = wrapper.wrap(pygplates.PolylineOnSphere(zip(y_list, x_list)))
        for line in wrapped:
            wrapped_subduction_polylines.append(
                LineString(np.array([j.to_lat_lon()[::-1] for j in line.get_points()]))
            )
    output_path = f"{OUTPUT_DIR}/subduction_zones"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    gpd.GeoDataFrame(
        {
            "id": list(range(len(wrapped_subduction_polylines)))
        },  # attributes (must be a list)
        geometry=wrapped_subduction_polylines,
        crs="EPSG:4326",  # IMPORTANT: define CRS
    ).to_file(
        f"{output_path}/topology_subduction_boundaries-{time}-Ma.shp",
        driver="ESRI Shapefile",
    )


def generate_static_polygons(plot_topologies_obj, time):
    """Generate static polygons and save as shapefile."""
    print(f"Generating static polygons for {time} Ma...")
    static_polygons = []

    static_polygons.extend(
        plot_topologies_obj.plate_reconstruction.static_polygons_snapshot(
            time
        ).get_reconstructed_geometries()
    )

    wrapped_static_polygons = []
    wrapper = pygplates.DateLineWrapper(central_meridian=0.0)
    for sp in static_polygons:
        wrapped = wrapper.wrap(sp.get_reconstructed_geometry())
        for polygon in wrapped:
            if polygon.get_number_of_interior_rings():
                print("Warning: skipping interior rings (holes) in the polygon. ")
            wrapped_static_polygons.append(
                Polygon(
                    np.array(
                        [j.to_lat_lon()[::-1] for j in polygon.get_exterior_points()]
                    )
                )
            )
    output_path = f"{OUTPUT_DIR}/static_polygons"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    gpd.GeoDataFrame(
        {
            "id": list(range(len(wrapped_static_polygons)))
        },  # attributes (must be a list)
        geometry=wrapped_static_polygons,
        crs="EPSG:4326",  # IMPORTANT: define CRS
    ).to_file(f"{output_path}/static-polygons-{time}-Ma.shp", driver="ESRI Shapefile")


def main():
    for time in range(411):
        plot_topologies_obj = gplately.auxiliary.get_gplot(
            "zahirovic2022",
            model_repo_dir="./plate_models_repository",
            time=time,
            default_anchor_plate_id=701701,  # 701701 is for the PMAG reference frame
        )
        # generate_plate_boundaries(plot_topologies_obj, time)
        # generate_coastlines(plot_topologies_obj, time)
        generate_subduction_lines(plot_topologies_obj, time)
        # generate_static_polygons(plot_topologies_obj, time)


if __name__ == "__main__":
    main()
