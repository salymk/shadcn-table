const firstNames = ["John", "Jane", "Mike", "Emily", "David", "Sarah", "Chris", "Anna", "Tom", "Lisa"]
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
]

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  const statusChance = Math.random()
  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? "relationship" : statusChance > 0.33 ? "complicated" : "single",
    progress: Math.floor(Math.random() * 100),
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
      }
    })
  }

  return makeDataLevel()
}

