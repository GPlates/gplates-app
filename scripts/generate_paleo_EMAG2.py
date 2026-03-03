#!/usr/bin/env python3
import os

os.environ["DISABLE_GPLATELY_DEV_WARNING"] = "true"
import cartopy.crs as ccrs
import matplotlib.pyplot as plt
from matplotlib import image

import gplately


def main(anchor_pid=701701):
    # set anchor plate id to 701701 to use ZAHIROVIC2022 PMAG model.
    model = gplately.auxiliary.get_plate_reconstruction(
        "ZAHIROVIC2022",
        model_repo_dir="plate-model-repo",
        default_anchor_plate_id=anchor_pid,
    )
    if not os.path.isfile("EMAG2.tif"):
        raise FileNotFoundError("EMAG2.tif not found in current directory")

    # remove the transparent background of EMAG2.tif and save it as EMAG2-no-transparent.tif
    os.system(
        "magick EMAG2.tif -background '#cccccc' -alpha remove -alpha off EMAG2-no-transparent.tif"
    )

    emag2 = gplately.Raster(
        data=image.imread("EMAG2-no-transparent.tif"),
        plate_reconstruction=model,
    )
    emag2.lats = emag2.lats[::-1]

    for time in range(0, 411):
        print(time)
        reconstructed_emag2 = emag2.reconstruct(
            time, fill_value="#cccccc", anchor_plate_id=anchor_pid
        )

        fig = plt.figure(figsize=(12, 6), dpi=300)

        # create the GeoAxes with no frame
        ax = fig.add_subplot(1, 1, 1, projection=ccrs.PlateCarree(), frameon=False)
        ax.set_axis_off()  # hide ticks/labels

        # make it fill the figure completely
        fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

        reconstructed_emag2.imshow(ax, interpolation="none")  # type: ignore

        output_dir = "reconstructed-EMAG2"
        if not os.path.isdir(output_dir):
            os.mkdir(output_dir)

        fig.savefig(
            f"{output_dir}/EMAG2-{time}-Ma.tif", bbox_inches="tight", pad_inches=0
        )  # bbox_inches="tight", pad_inches=0 are essential to remove the white border around the image

        os.system(
            f"magick {output_dir}/EMAG2-{time}-Ma.tif -background '#cccccc' -alpha remove -alpha off tmp.png"
        )

        os.system(
            f"gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  tmp.png {output_dir}/EMAG2-{time}-Ma.tif"
        )

        os.system("rm tmp.png")


if __name__ == "__main__":
    main()
