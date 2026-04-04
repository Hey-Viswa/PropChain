import hardhat from 'hardhat'

const { ethers } = hardhat

async function main() {
  const accounts = await ethers.getSigners()
  accounts.forEach((a, i) => console.log(`Account [${i}]: ${a.address}`))
}

main().catch(console.error)
