cmake_minimum_required(VERSION 3.16)

project(playground LANGUAGES C CXX)

include(GNUInstallDirs)

include(cmake/flags.cmake)
include(cmake/import.cmake)

add_executable(playground src/wasm.cc)

import_dependency(ada ada-url/ada beadd6057875d900db60fedcde6dfe803936daad)
add_dependency(ada)

set_target_properties(playground PROPERTIES LINK_FLAGS    "-Os -s WASM=1 -s ENVIRONMENT=web -s EXPORT_ES6=1 -s EXPORT_NAME=loadWASM -s MODULARIZE=1 --bind --no-entry")
target_link_libraries(playground PRIVATE ada)
