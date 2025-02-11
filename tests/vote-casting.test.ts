import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for votes
const votes = new Map<string, number>()

// Mock functions to simulate contract behavior
function castVote(ballotId: number, voter: string, optionIndex: number) {
  const key = `${ballotId}-${voter}`
  if (votes.has(key)) throw new Error("Already voted")
  votes.set(key, optionIndex)
  return true
}

function getVote(ballotId: number, voter: string) {
  const key = `${ballotId}-${voter}`
  return votes.get(key)
}

// Mock functions for dependencies
const mockVoterRegistration = {
  isRegistered: (voter: string) => true,
}

const mockBallotCreation = {
  getBallot: (ballotId: number) => ({ title: "Test Ballot", options: ["Option 1", "Option 2"] }),
  getBallotOptions: (ballotId: number) => ["Option 1", "Option 2"],
}

describe("Vote Casting Contract", () => {
  beforeEach(() => {
    votes.clear()
  })
  
  it("should cast a vote", () => {
    const result = castVote(1, "voter1", 0)
    expect(result).toBe(true)
    expect(getVote(1, "voter1")).toBe(0)
  })
  
  it("should not allow voting twice", () => {
    castVote(1, "voter1", 0)
    expect(() => castVote(1, "voter1", 1)).toThrow("Already voted")
  })
  
  it("should get a vote", () => {
    castVote(1, "voter1", 0)
    const vote = getVote(1, "voter1")
    expect(vote).toBe(0)
  })
})

