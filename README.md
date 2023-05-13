# utoob

YouTube download CLI tool

## Installation
Install globally with:
`npm i -g utoob`

## Usage
`utoob 'https://youtu.be/V_Ac-SVYI48'`

Downloads target video in MP4 @ 720p (or next-best available option)

### Options

#### Specify Filename

You can use `-n` or `--filename` to specify an output filename (exclude file extension)

Example: `utoob 'https://youtu.be/uQhTuRlWMxw' -n 'Linear Algebra - Chapter 7'`

_When omitted, this defaults to the title as listed on YouTube_

#### Specify Output Directory

You can use `-o` or `--output-dir` to specify an output directory

Example: `utoob 'https://youtu.be/uQhTuRlWMxw' -o '/Users/example/downloads'`

_When omitted, this defaults to the current working directory_
