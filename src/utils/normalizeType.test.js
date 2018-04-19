import { normalizeType } from './normalizeType';

const pairs = [ ["1", 1], 
                  [true, true], 
                  [10, 10], 
                  ["010", 10], 
                  ["1.", 1], 
                  ["-1090", -1090], 
                  ["-1090.0", -1090], 
                  ["1.0", 1.0],
                  ["1.1", 1.1],
                  ["000001.1", 1.1],
                  ["hi", "hi"],
                  ["", ""],
                  ["0.0", 0.0],
                  ["a0.0", "a0.0"],
                  ["0-0", "0-0"],
                  ["0+0", "0+0"],
                  ["+4", "+4"],
                  ["0.0a", "0.0a"],
                  ["0a0", "0a0"],
                  ["1.0.0", "1.0.0"],
                  ["0", 0],
                  ["true", true],
                  ["True", true],
                  ["false", false],
                  ["False", false],
                  [" 1.0", 1.0],
                  ["1.0 ", 1.0]
                ]

describe('normalizeType', () => {
  pairs.forEach( i => {
    it(`properly converts the string "${i[0]}" to ${typeof i[1]} (${i[1]})`, () => {
      expect(normalizeType(i[0])).toEqual(i[1]);
    })
  })
});
