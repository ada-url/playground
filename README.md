## Playground

This repository contains a CPP and a JavaScript project
to provide a playground for the Ada url parser.

![screenshot](screenshot.png?raw=true 'Playground Screenshot')

### Installation

#### cpp

For installing and building, run  the following commands:

- `cd cpp`
- `cmake -B build`
- `cmake --build build`

To run the server on port 4242:

- `./build/playground`

#### ui

For installing and building, run the following commands:

- `cd ui`
- `npm install`

To run the server on port 3000:

- `npm run dev`

To change the default API_URL, use the following command:

- `NEXT_PUBLIC_API_URL=http://0.0.0.0:4242 npm run dev`