import { isPalindrome } from '../../utils/helpers'

describe('isPalindrome Function', () => {
    it('should return true if a string is a palindrome', async (done) => {

        const inputString = 'anana'
        expect(isPalindrome(inputString)).toBe(true)
        done()
    });

    it('should return false if a string is not a palindrome', async (done) => {

        const inputString = 'anon'
        expect(isPalindrome(inputString)).toBe(false)
        done()
    });
})
