App Store Preview

- use ios simulator to record screen
- use iMoive to speed up video (App Preview project)
- insert a silent audio channel `ffmpeg -i input.mp4 -f lavfi -i anullsrc -c:v copy -c:a aac -shortest silent.mp4`
- resize, make sure the h246 level and fps not too high `ffmpeg -i silent.mp4 -filter:v fps=30,scale=1200:1600,setsar=1 -c:v libx264 -profile:v main -level:v 3.1 -c:a copy output.mp4`
- Check the final video `ffprobe -loglevel error -show_streams GPlates-App-preview-age-grid.mp4`
