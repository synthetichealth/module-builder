import { findAvailableKey, createSafeKeyFromName } from './keys';

const keys = ['one', 'two', 'three', 'three_2', 'three_3']

it('creates a new key when there are no currently that match', () => {
  expect(findAvailableKey('next', keys)).toEqual('next')
})

it('creates a new key that appends _2 when there is one match', () => {
  expect(findAvailableKey('one', keys)).toEqual('one_2')
})

it('creates a new key that appends _4 when there are three matches', () => {
  expect(findAvailableKey('three', keys)).toEqual('three_4')
})

it('creates a new key that appends _4 when there are three matches', () => {
  expect(findAvailableKey('three_2', keys)).toEqual('three_4')
})

it('creates a key from a name properly', () => {
  expect(createSafeKeyFromName('modulename')).toEqual('modulename')
  expect(createSafeKeyFromName('ModuleName')).toEqual('modulename')
  expect(createSafeKeyFromName('Module Name')).toEqual('module_name')
  expect(createSafeKeyFromName('Module!Name')).toEqual('module_name')
})
