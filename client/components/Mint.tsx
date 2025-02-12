import Image from "next/image";
import { AiOutlineDown } from "react-icons/ai";
import ethLogo from "../assets/eth.png";
import token1 from "../assets/token1.png";
import token2 from "../assets/token2.png";
import { useContext, useState, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import Modal from "react-modal";
import { useRouter } from "next/router";
import TransactionLoader from "./TransactionLoader";
import styles from "./Main.module.css";
import { ethers } from "ethers";
import { NextPage } from "next";
import { Dispatch, SetStateAction } from "react";

Modal.setAppElement("#__next");

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl  border border-[#20242A] hover:border-[#41444F]  flex justify-between relative`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-6 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

interface MintProps {
  Account: string;
  ERC20_1Contract: ethers.Contract | null;
  ERC20_2Contract: ethers.Contract | null;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0a0b0d",
    padding: 0,
    border: "none",
  },
  overlay: {
    backgroundColor: "rgba(10, 11, 13, 0.75)",
  },
};

const Mint: NextPage<MintProps> = ({
  ERC20_1Contract,
  ERC20_2Contract,
  Account,
  setToken,
}) => {
  const { formData, handleChange, saveTransaction } =
    useContext(TransactionContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(0);
  const [currency, setCurrency] = useState("TKN1");
  const [showMenu, setShowMenu] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number | null>(null);

  const handleBalance = async () => {
    let currBalance;
    if (currency === "TKN1") {
      currBalance = await ERC20_1Contract?.balanceOf(Account);
    } else if (currency === "TKN2") {
      currBalance = await ERC20_2Contract?.balanceOf(Account);
    }
    setBalanceAmount(Number(currBalance));
  };

  useEffect(() => {
    console.log(ERC20_1Contract);
    console.log(ERC20_2Contract);
    console.log(Account);
    handleBalance();
  }, [currency]);

  const handleSubmit = async (e: any) => {
    console.log("Hi");
    e.preventDefault();
    // const { addressTo, amount } = formData;

    // if (!addressTo || !amount) return;

    setLoading(true);
    console.log(loading);
    try {
      if (contract === 0) {
        const chk = await ERC20_1Contract?.isMintPossible();
        if (Number(chk) == 0) {
          alert(
            "Minting Limit Reached, Please try after some time! Note:10,000 tokens can be minted every 1 hour"
          );
        } else {
          const transactionHash = await ERC20_1Contract?.mint();
          await transactionHash?.wait();
        }
      } else {
        const chk = await ERC20_2Contract?.isMintPossible();
        if (chk == 0) {
          alert(
            "Minting Limit Reached, Please try after some time! Note:10,000 tokens of each type can be minted every 1 hour"
          );
        } else {
          const transactionHash = await ERC20_2Contract?.mint();
          await transactionHash?.wait();
        }
      }
      alert("Transaction Completed !");
    } catch (err) {
      alert(err);
    }
    setLoading(false);

    
  };

  function handleClick() {
    setShowMenu((prev) => {
      return !prev;
    });
  }

  return (
    <div className={style.wrapper}>
      {loading && <TransactionLoader />}
      {!loading && (
        <div>
          <div className={style.content}>
            <div className={style.formHeader}>
              <div className=" w-screen flex justify-between">
                <div>Mint</div>
                <div>
                  Balance : {balanceAmount} {currency}
                </div>
              </div>
            </div>
            <div className={style.transferPropContainer}>
              <input
                type="text"
                className={style.transferPropInput}
                placeholder="10000.00"
                pattern="^[0-9]*[.,]?[0-9]*$"
                onChange={(e) => handleChange(e, "amount")}
                disabled
              />
              <div className={style.currencySelector} onClick={handleClick}>
                <div className={style.currencySelectorContent}>
                  <div className={style.currencySelectorIcon}>
                    <Image
                      src= {currency === "TKN1" ? token1 : token2}
                      alt="eth logo"
                      height={20}
                      width={20}
                    />
                  </div>
                  <div className={style.currencySelectorTicker}>{currency}</div>
                  <AiOutlineDown className={style.currencySelectorArrow} />
                </div>
              </div>
              {showMenu && (
                <div
                  className={styles.dropdownmenu}
                  onClick={() => setShowMenu(false)}
                >
                  <ul>
                    <li
                      onClick={() => {
                        setCurrency("TKN1");
                        setContract(0);
                        setToken("TKN1");
                      }}
                    >
                      TKN1
                    </li>
                    <li
                      onClick={() => {
                        setCurrency("TKN2");
                        setContract(1);
                        setToken("TKN2");
                      }}
                    >
                      TKN2
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div
              onClick={(e) => handleSubmit(e)}
              className={style.confirmButton}
            >
              Mint
            </div>
          </div>

          <Modal isOpen={!!router.query.loading} style={customStyles}>
            <TransactionLoader />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Mint;
