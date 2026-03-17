#!/usr/bin/env python3
import gplately
import os
from plate_model_manager import PlateModelManager

"""
end_time = 410
# input files
grid_directory = "../GPlatesAppData/ReconstructedPaleogeography"
input_grid_filename = grid_directory + "/Paleogeography/paleogeo_{}.nc"

# output files
output_grid_directory = grid_directory + "/Paleogeography-PMAG"
os.makedirs(output_grid_directory, exist_ok=True)
output_grid_filename = output_grid_directory + "/paleogeo_{}.nc"
"""

"""
end_time = 250
# input files
grid_directory = "../GPlatesAppData/ReconstructedSpreadingRateGrids"
input_grid_filename = grid_directory + "/mantle-ref-frame/Seton_etal_2020_SR_{}Ma.nc"

# output files
output_grid_directory = grid_directory + "/pmag-ref-frame"
os.makedirs(output_grid_directory, exist_ok=True)
output_grid_filename = output_grid_directory + "/Seton_etal_2020_SR_{}Ma.nc"
"""
start_time = 163
end_time = 250
# input files
grid_directory = "../GPlatesAppData/ReconstructedAsymmetryGrids"
input_grid_filename = (
    grid_directory + "/mantle-ref-frame/Seton_etal_2020_Asymmetry_{}Ma.nc"
)

# output files
output_grid_directory = grid_directory + "/pmag-ref-frame"
os.makedirs(output_grid_directory, exist_ok=True)
output_grid_filename = output_grid_directory + "/Seton_etal_2020_Asymmetry_{}Ma.nc"

plate_model = PlateModelManager().get_model(
    "ZAHIROVIC2022", data_dir="plate-model-repo"
)
from_rotation_files = plate_model.get_rotation_model()
to_rotation_files = plate_model.get_rotation_model()
from_rotation_reference_plate = 0
to_rotation_reference_plate = 701701
grid_spacing_degrees = 0.1  # Input and output grid sample spacing (in degrees).


for reconstruction_time in range(start_time, end_time + 1):
    print(f"Rotating grid for reconstruction time {reconstruction_time} Ma...")
    rasterobj = gplately.grids.Raster(
        input_grid_filename.format(reconstruction_time), time=reconstruction_time
    )
    rotate_frame_function = rasterobj.rotate_reference_frames(
        grid_spacing_degrees=grid_spacing_degrees,
        reconstruction_time=reconstruction_time,
        from_rotation_features_or_model=from_rotation_files,
        to_rotation_features_or_model=to_rotation_files,
        from_rotation_reference_plate=from_rotation_reference_plate,
        to_rotation_reference_plate=to_rotation_reference_plate,
        output_name=output_grid_filename.format(reconstruction_time),
    )


"""from joblib import Parallel, delayed
import joblib

converted_frames = Parallel(n_jobs=-2, backend='loky', verbose=1) \
    (delayed(rotate_grid) \
(
    input_grid_filename = input_grid_filename.format(reconstruction_time),
    reconstruction_time=reconstruction_time,
    output_name=output_grid_filename.format(reconstruction_time),
)
     for i, reconstruction_time in enumerate(reconstruction_times))

"""
