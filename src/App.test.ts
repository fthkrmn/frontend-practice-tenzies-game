import { describe, it, expect } from "vitest"
import { generateAllNewDice } from "./App"  // <-- export this function to test it

describe("generateAllNewDice", () => {
    it("creates 10 dice with correct structure", () => {
        const dice = generateAllNewDice()
        expect(dice.length).toBe(10)
        dice.forEach(die => {
            expect(typeof die.value).toBe("number")
            expect(typeof die.isHeld).toBe("boolean")
            expect(typeof die.id).toBe("string")
        })
    })
})
