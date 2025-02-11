import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for ballots
const ballots = new Map<number, { title: string; options: string[]; creator: string }>()
let lastBallotId = 0

// Mock functions to simulate contract behavior
function createBallot(title: string, options: string[], creator: string) {
  if (options.length > 10) throw new Error("Too many options")
  const newBallotId = ++lastBallotId
  ballots.set(newBallotId, { title, options, creator })
  return newBallotId
}

function closeBallot(ballotId: number, caller: string) {
  const ballot = ballots.get(ballotId)
  if (!ballot) throw new Error("Ballot not found")
  if (ballot.creator !== caller) throw new Error("Unauthorized")
  ballots.delete(ballotId)
  return true
}

function getBallot(ballotId: number) {
  return ballots.get(ballotId)
}

function getBallotOptions(ballotId: number) {
  const ballot = ballots.get(ballotId)
  if (!ballot) throw new Error("Ballot not found")
  return ballot.options
}

describe("Ballot Creation Contract", () => {
  beforeEach(() => {
    ballots.clear()
    lastBallotId = 0
  })
  
  it("should create a ballot", () => {
    const ballotId = createBallot("Test Ballot", ["Option 1", "Option 2"], "creator1")
    expect(ballotId).toBe(1)
    const ballot = getBallot(ballotId)
    expect(ballot).toEqual({
      title: "Test Ballot",
      options: ["Option 1", "Option 2"],
      creator: "creator1",
    })
  })
  
  it("should not create a ballot with too many options", () => {
    const options = Array.from({ length: 11 }, (_, i) => `Option ${i + 1}`)
    expect(() => createBallot("Test Ballot", options, "creator1")).toThrow("Too many options")
  })
  
  it("should close a ballot", () => {
    const ballotId = createBallot("Test Ballot", ["Option 1", "Option 2"], "creator1")
    const result = closeBallot(ballotId, "creator1")
    expect(result).toBe(true)
    expect(getBallot(ballotId)).toBeUndefined()
  })
  
  it("should not close a ballot if not the creator", () => {
    const ballotId = createBallot("Test Ballot", ["Option 1", "Option 2"], "creator1")
    expect(() => closeBallot(ballotId, "creator2")).toThrow("Unauthorized")
  })
  
  it("should get ballot options", () => {
    const ballotId = createBallot("Test Ballot", ["Option 1", "Option 2"], "creator1")
    const options = getBallotOptions(ballotId)
    expect(options).toEqual(["Option 1", "Option 2"])
  })
})

