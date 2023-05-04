cmake_minimum_required(VERSION 3.16)

project(playground LANGUAGES C CXX)

include(GNUInstallDirs)

include(cmake/flags.cmake)
include(cmake/import.cmake)

set(CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/scripts/cmake)

add_executable(playground src/main.cc)

# TODO: Find a way to remove this
set(OPENSSL_ROOT_DIR /opt/homebrew/opt/openssl@1.1)
find_package(Drogon CONFIG REQUIRED)
target_link_libraries(playground PRIVATE Drogon::Drogon)

import_dependency(ada ada-url/ada 12df64871fa9f7266e326dbc929ac8980f20ffe8)
add_dependency(ada)
target_link_libraries(playground PRIVATE ada)
