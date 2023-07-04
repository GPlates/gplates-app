App Store Preview

- use ios simulator to record screen
- use iMoive to speed up video (App Preview project)
- use Adobe online service to resize the video
- make sure the h246 level not too high `ffmpeg -i input.00.mp4 -s 1200x1600 -filter:v fps=30,scale=1200:1600,setsar=1  -c:v libx264 -profile:v main -level:v 3.1 -c:a copy output.mp4`
- `ffprobe -loglevel error -show_streams GPlates-App-preview-age-grid.mp4`
