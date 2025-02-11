import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for registered voters
const registeredVoters = new Set<string>()
let registrationOpen = true
const contractOwner = "owner1"

// Mock functions to simulate contract behavior
function registerVoter(voter: string) {
  if (!registrationOpen) throw new Error("Registration closed")
  if (registeredVoters.has(voter)) throw new Error("Already registered")
  registeredVoters.add(voter)
  return true
}

function unregisterVoter(voter: string) {
  if (!registeredVoters.has(voter)) throw new Error("Not registered")
  registeredVoters.delete(voter)
  return true
}

function closeRegistration(caller: string) {
  if (caller !== contractOwner) throw new Error("Unauthorized")
  registrationOpen = false
  return true
}

function openRegistration(caller: string) {
  if (caller !== contractOwner) throw new Error("Unauthorized")
  registrationOpen = true
  return true
}

function isRegistered(voter: string) {
  return registeredVoters.has(voter)
}

function isRegistrationOpen() {
  return registrationOpen
}

describe("Voter Registration Contract", () => {
  beforeEach(() => {
    registeredVoters.clear()
    registrationOpen = true
  })
  
  it("should register a voter", () => {
    const result = registerVoter("voter1")
    expect(result).toBe(true)
    expect(isRegistered("voter1")).toBe(true)
  })
  
  it("should not register a voter twice", () => {
    registerVoter("voter1")
    expect(() => registerVoter("voter1")).toThrow("Already registered")
  })
  
  it("should unregister a voter", () => {
    registerVoter("voter1")
    const result = unregisterVoter("voter1")
    expect(result).toBe(true)
    expect(isRegistered("voter1")).toBe(false)
  })
  
  it("should not unregister a non-registered voter", () => {
    expect(() => unregisterVoter("voter1")).toThrow("Not registered")
  })
  
  it("should close registration when called by the owner", () => {
    const result = closeRegistration(contractOwner)
    expect(result).toBe(true)
    expect(isRegistrationOpen()).toBe(false)
  })
  
  it("should not close registration when called by non-owner", () => {
    expect(() => closeRegistration("non-owner")).toThrow("Unauthorized")
  })
  
  it("should open registration when called by the owner", () => {
    closeRegistration(contractOwner)
    const result = openRegistration(contractOwner)
    expect(result).toBe(true)
    expect(isRegistrationOpen()).toBe(true)
  })
  
  it("should not open registration when called by non-owner", () => {
    expect(() => openRegistration("non-owner")).toThrow("Unauthorized")
  })
  
  it("should not register when registration is closed", () => {
    closeRegistration(contractOwner)
    expect(() => registerVoter("voter1")).toThrow("Registration closed")
  })
})

