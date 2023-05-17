cmake_minimum_required(VERSION 3.16)

project(playground LANGUAGES C CXX)

include(GNUInstallDirs)

include(cmake/flags.cmake)
include(cmake/import.cmake)

set(EMSDK_ROOT $ENV{EMSCRIPTEN})
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${EMSDK_ROOT}/cmake/Modules")
set(CMAKE_PREFIX_PATH ${CMAKE_PREFIX_PATH} "${EMSDK_ROOT}/cmake/Modules")
SET(CMAKE_C_COMPILER   "${EMSDK_ROOT}/emcc")
SET(CMAKE_CXX_COMPILER "${EMSDK_ROOT}/em++")

add_executable(playground src/wasm.cc)


import_dependency(ada ada-url/ada 12df64871fa9f7266e326dbc929ac8980f20ffe8)
add_dependency(ada)

set_target_properties(playground PROPERTIES LINK_FLAGS    "-Os -s WASM=1 -s ENVIRONMENT=web -s EXPORT_ES6=1 -s EXPORT_NAME=loadWASM -s MODULARIZE=1 --bind --no-entry")
target_link_libraries(playground PRIVATE ada)
