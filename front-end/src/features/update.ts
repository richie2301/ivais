import { useState, useCallback } from 'react'

const useForceUpdate = () => {
  const [, setState] = useState({})
  const update = useCallback(() => setState({}), [])
  return update
}

export default useForceUpdate