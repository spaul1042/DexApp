import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import ethLogo from '../assets/eth.png'
import uniswapLogo from '../assets/uniswap.png'
import ammLogo from '../assets/ammLogo.jpg'

import { useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import { client } from '../lib/sanityClient'
import { NextPage } from 'next'
import { ethers } from 'ethers';
import { Dispatch, SetStateAction } from 'react';

const style = {
	wrapper: `p-4 w-screen flex justify-between items-center`,
	headerLogo: `flex w-1/4 items-center justify-start rounded-full overflow-hidden`,
	nav: `flex-1 flex justify-center items-center`,
	navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
	navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
	activeNavItem: `bg-[#20242A]`,
	buttonsContainer: `flex w-1/4 justify-end items-center`,
	button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
	buttonPadding: `p-2`,
	buttonTextContainer: `h-8 flex items-center`,
	buttonIconContainer: `flex items-center justify-center w-8 h-8`,
	buttonAccent: `bg-[#172A42] w-40 border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
}

interface MainProps {
	ERC20_1Contract: ethers.Contract | null;
	ERC20_2Contract: ethers.Contract | null;
	Account: string;
	setCurrPage: React.Dispatch<React.SetStateAction<string>>;
	token: string;
}


const Header: NextPage<MainProps> = ({ ERC20_1Contract, ERC20_2Contract, Account, setCurrPage, token }) => {

	const [selectedNav, setSelectedNav] = useState('send')
	const [userName, setUserName] = useState<string>()
	const { connectWallet, currentAccount } = useContext(TransactionContext)
	const [balanceAmount, setBalanceAmount] = useState<number | null>(null);
	const [showBalance, setShowBalance] = useState(false);


	// const handleBalance = async () => {
	// 	let currBalance;
	// 	if (token === "TKN1") {
	// 		currBalance = await ERC20_1Contract?.balanceOf(Account);

	// 	}
	// 	else if (token === "TKN2") {
	// 		currBalance = await ERC20_2Contract?.balanceOf(Account);
	// 	}
	// 	setBalanceAmount(Number(currBalance));
	// 	setShowBalance((prev) => !prev);
	// }


	useEffect(() => {
		if (currentAccount) {
			; (async () => {
				const query = `
        *[_type=="users" && _id == "${currentAccount}"] {
          userName,
        }
        `
				const clientRes = await client.fetch(query)
				console.log(clientRes)
				if (!(clientRes[0]?.userName == 'Unnamed')) {
					setUserName(clientRes[0].userName)
				} else {
					setUserName(
						`${currentAccount.slice(0, 7)}...${currentAccount.slice(35)}`,
					)
				}
			})()

		}
		// handleBalance();
	}, [currentAccount, token])

	return (
		<div className={style.wrapper}>
			<div className={style.headerLogo}>
				<Image src={ammLogo} alt='uniswap' height={40} width={40} />
			</div>
			<div className={style.nav}>
				<div className={style.navItemsContainer}>
					<div
						onClick={() => {
							setSelectedNav('send')
							setCurrPage("send")
						}}
						className={`${style.navItem} ${selectedNav === 'send' && style.activeNavItem
							}`}
					>
						Send
					</div>
					<div
						onClick={() => {
							setSelectedNav('mint')
							setCurrPage("mint")
						}}
						className={`${style.navItem} ${selectedNav === 'mint' && style.activeNavItem
							}`}
					>
						Mint
					</div>
					<div
						onClick={() => {
							setSelectedNav('pool')
							setCurrPage("pool")
						}}
						className={`${style.navItem} ${selectedNav === 'pool' && style.activeNavItem
							}`}
					>
						Pool
					</div>
					<div
						onClick={() => {
							setSelectedNav('swap')
							setCurrPage("swap")
						}}
						className={`${style.navItem} ${selectedNav === 'swap' && style.activeNavItem
							}`}
					>
						Swap
					</div>
					<div
						onClick={() => {
							setSelectedNav('liquidity')
							setCurrPage("liquidity")
						}
						}
						className={`${style.navItem} ${selectedNav === 'liquidity' && style.activeNavItem
							}`}
					>
						Liquidity
					</div>
					<a
						href='https://coinmarketcap.com/'
						target='_blank'
						rel='noreferrer'
					>
						<div className={style.navItem}>
							Charts <FiArrowUpRight />
						</div>
					</a>
				</div>
			</div>
			<div className={style.buttonsContainer}>
				<div className={`${style.button} ${style.buttonPadding}`}>
					<div className={style.buttonIconContainer}>
						<Image src={ethLogo} alt='eth logo' height={20} width={20} />
					</div>
					<p>Sepolia</p>
				</div>
				{currentAccount ? (
					<div className={`${style.button} ${style.buttonPadding}`}>
						<div className={style.buttonTextContainer}>{userName}</div>
					</div>
				) : (
					<div
						onClick={() => connectWallet()}
						className={`${style.button} ${style.buttonPadding}`}
					>
						<div className={`${style.buttonAccent} ${style.buttonPadding}`}>
							Connect Wallet
						</div>
					</div>
				)}
				{/* <div onClick={() => handleBalance()} className={`${style.button} ${style.buttonPadding} px-10`}>
					<div className={`${style.buttonIconContainer} mx-6`}>
						{showBalance ? balanceAmount + " " + token : "Balance"}
					</div>
				</div> */}
			</div>
		</div>
	)
}

export default Header
