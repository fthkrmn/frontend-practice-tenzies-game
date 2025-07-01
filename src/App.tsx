import { useState, useRef, useEffect } from "react"
import type { JSX } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

/**
 * value: Number shown on the die (1 to 6).
 * isHeld: Whether the die is highlighted.
 * id: Unique id given to component by nanoid.
 */
type DieType = {
    value:number,
    isHeld:boolean,
    id:string
}

/**
 * Generates an array of 10 dice with random values.
 * Each die is not held by default.
 * @returns Array of dice objects with value, isHeld, and id.
 */
export function generateAllNewDice():DieType[] {
    return new Array(10)
        .fill(0)
        .map(() => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }))
}

export default function App() {
    const [dice, setDice] = useState<DieType[]>(() => generateAllNewDice())
    const buttonRef = useRef<HTMLButtonElement>(null)

    const gameWon:boolean = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current?.focus()
        }
    }, [gameWon])

    /**
     * Generates a new value for each die not held.
     * If the game is won, generates values for all dice.
     */
    function rollDice():void {
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
        }
    }

    /**
     * Toggles the `isHeld` status of a die by ID.
     * @parameter id - The unique ID (nanoid) of the die to update.
     */
    function hold(id:string):void {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements:JSX.Element[] = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
