from pathlib import Path

import cartopy.crs as ccrs
import matplotlib.colors as colors
import matplotlib.pyplot as plt
import numpy as np
from netCDF4 import Dataset
from scipy.ndimage import gaussian_filter


def merge_grids(topo_file, bathy_file, out_file_stem):
    dem = Dataset(topo_file)
    dem_data = np.asarray(dem.variables["z"])

    # filter the topography data
    # dem_data = gaussian_filter(dem_data, sigma=2.0)

    bathy = Dataset(bathy_file)
    bathy_data = np.asarray(bathy.variables["z"])
    bathy_data = np.roll(bathy_data, int(bathy_data.shape[1] / 2))

    assert dem_data.shape == bathy_data.shape

    dem_bathy = np.empty(dem_data.shape)

    for i in range(dem_data.shape[0]):
        for j in range(dem_data.shape[1]):
            if not np.isnan(bathy_data[i][j]):
                dem_bathy[i][j] = bathy_data[i][j]
            else:
                dem_bathy[i][j] = dem_data[i][j]

    dem_bathy = gaussian_filter(dem_bathy, sigma=5.0)

    Path(f"output/netcdf/").mkdir(parents=True, exist_ok=True)
    Path(f"output/tiff/").mkdir(parents=True, exist_ok=True)

    dem_bathy_nc = Dataset(f"output/netcdf/{out_file_stem}.nc", "w", "NETCDF4")
    dem_bathy_nc.createDimension("lat", dem_bathy.shape[0])
    dem_bathy_nc.createDimension("lon", dem_bathy.shape[1])

    lat_var = dem_bathy_nc.createVariable("lat", "float32", ("lat"))
    lat_var[:] = np.linspace(-90, 90, num=dem_bathy.shape[0])
    lon_var = dem_bathy_nc.createVariable("lon", "float32", ("lon"))
    lon_var[:] = np.linspace(-180, 180, num=dem_bathy.shape[1])
    dem_bathy_var = dem_bathy_nc.createVariable("z", "float32", ("lat", "lon"))
    # crustal_var.setncattr("units", "metre(m)")
    # dem_bathy_var[:] = np.transpose(dem_bathy)
    dem_bathy_var[:] = dem_bathy
    dem_bathy_nc.close()

    # https://matplotlib.org/stable/tutorials/colors/colormapnorms.html#twoslopenorm-different-mapping-on-either-side-of-a-center

    # make a colormap that has land and ocean clearly delineated and of the
    # same length (256 + 256)
    colors_undersea = plt.cm.terrain(np.linspace(0, 0.17, 256))
    colors_land = plt.cm.terrain(np.linspace(0.25, 1, 256))
    all_colors = np.vstack((colors_undersea, colors_land))
    terrain_map = colors.LinearSegmentedColormap.from_list("terrain_map", all_colors)

    # make the norm:  Note the center is offset so that the land has more
    # dynamic range:
    divnorm = colors.TwoSlopeNorm(vmin=-8000.0, vcenter=0, vmax=3100)

    # resize and smooth
    ##data = np.asarray(img.variables['z'])
    # data = ndimage.zoom(data, 10.0)
    # data = gaussian_filter(data, sigma=5.)

    fig = plt.figure(figsize=(16, 12), dpi=540)
    ax = plt.axes(projection=ccrs.PlateCarree(), frameon=False)

    ax.imshow(
        dem_bathy,
        cmap=terrain_map,
        norm=divnorm,
        origin="lower",
        transform=ccrs.PlateCarree(),
        extent=[-180, 180, -90, 90],
    )

    # save the figure without frame so that the image can be used to project onto a globe
    fig.savefig(
        f"output/tiff/{out_file_stem}.tiff",
        bbox_inches="tight",
        pad_inches=0,
        dpi=120,
        transparent=True,
    )
    plt.close(fig)


if __name__ == "__main__":
    for age in range(251):
        print(age)
        merge_grids(
            f"paleotopo-3601x1801/paleotop-3601x1801-{age}Ma.nc",
            f"paleo_bathymetry_6m_1.4_RHCW18_M19/paleo_bathymetry_{age}.nc",
            f"paleobathymetry-with-topo-{age}-Ma",
        )
