
set(NSCALC_SRC ${CMAKE_BINARY_DIR}/nscalc_stub/src/gen/js/nscalc.ts)
set(NSCALC_DST ${CMAKE_CURRENT_SOURCE_DIR}/src/rpc/nscalc.ts)

add_custom_command(
  OUTPUT ${NSCALC_DST}
  COMMAND ${CMAKE_COMMAND} -E make_directory ${CMAKE_CURRENT_SOURCE_DIR}/src/rpc
  COMMAND ${CMAKE_COMMAND} -E copy_if_different ${NSCALC_SRC} ${NSCALC_DST}
  DEPENDS ${NSCALC_SRC}
  COMMENT "Copying nscalc generated TypeScript headers to ${NSCALC_DST}"
  VERBATIM
)

add_custom_command(
  OUTPUT nscalc_js.stamp
  COMMAND  npm ci && npm run build-prd
  WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
  DEPENDS ${NSCALC_DST}
  COMMENT "Building nscalc TypeScript client"
  VERBATIM
)

add_custom_target(nscalc_js ALL
  DEPENDS
    nscalc_js.stamp
    nscalc_stub_gen
)