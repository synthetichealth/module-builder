export const analyze = (moduleKey, module) => {
  return ({
    type: 'ANALYZE',
    data: {moduleKey, module}
  })
}
