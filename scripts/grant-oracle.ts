import hre from 'hardhat'

const { ethers } = hre

async function main() {
  console.log('\n=== Grant Oracle Role Script ===\n')

  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const accounts = await ethers.getSigners()
  
  // Print all available test accounts
  console.log('Available Hardhat Test Accounts:')
  console.log('─'.repeat(80))
  for (let i = 0; i < Math.min(5, accounts.length); i++) {
    const account = accounts[i]
    const balance = await ethers.provider.getBalance(account.address)
    console.log(`Account #${i}: ${account.address}`)
    console.log(`  Balance: ${ethers.formatEther(balance)} ETH\n`)
  }
  console.log('─'.repeat(80))

  const admin = accounts[0]  // DEFAULT_ADMIN_ROLE holder
  const targetWallet = accounts[0]  // Grant Oracle role to account #0 (same as admin for browser testing)

  console.log(`\nUsing Admin (account #0): ${admin.address}`)
  console.log(`Target Oracle Wallet (account #0): ${targetWallet.address} [SAME AS ADMIN FOR BROWSER]`)

  // Load ABI from artifacts
  const PropertyNFT = await ethers.getContractFactory('PropertyNFT')
  const contract = PropertyNFT.attach(CONTRACT_ADDRESS)

  // Compute ORACLE_ROLE
  const ORACLE_ROLE = ethers.keccak256(ethers.toUtf8Bytes('ORACLE_ROLE'))
  console.log(`\nORACLE_ROLE hash: ${ORACLE_ROLE}`)

  // Check current state
  const alreadyOracle = await contract.hasRole(ORACLE_ROLE, targetWallet.address)
  console.log(`\nhasRole (before): ${alreadyOracle}`)

  if (alreadyOracle) {
    console.log('\n✅ Wallet already has Oracle role!')
  } else {
    console.log('\n⚠️  Granting ORACLE_ROLE...')
    const tx = await contract.connect(admin).grantRole(ORACLE_ROLE, targetWallet.address)
    console.log(`Transaction hash: ${tx.hash}`)
    
    const receipt = await tx.wait()
    console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`)
  }

  // Verify
  const isOracle = await contract.hasRole(ORACLE_ROLE, targetWallet.address)
  console.log(`\nhasRole (after): ${isOracle}`)

  if (isOracle) {
    console.log('\n🎉 Oracle role successfully granted to account[0]!')
    console.log('\n' + '─'.repeat(80))
    console.log('BROWSER TESTING READY:')
    console.log(`1. Wallet ${targetWallet.address} now has ORACLE_ROLE`)
    console.log('2. This wallet is already imported in your browser (Hardhat account[0])')
    console.log('3. Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
    console.log('\n4. Navigate to http://localhost:3000/oracle')
    console.log('5. Enter passphrase: propchain123')
    console.log('6. Start approving properties!')
    console.log('─'.repeat(80))
  } else {
    console.error('\n❌ Failed to grant Oracle role')
    process.exit(1)
  }
}

main().catch(console.error)
