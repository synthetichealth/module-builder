export const analyze = (module) => {
  return ({
    type: 'ANALYZE',
    data: {module}
  })
}
