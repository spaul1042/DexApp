import Image from "next/image";
import { RiSettings3Fill } from "react-icons/ri";
import { AiOutlineDown } from "react-icons/ai";
import ethLogo from "../assets/eth.png";
import { useContext, useState, useEffect } from "react";
import { TransactionContext } from "../context/TransactionContext";
import Modal from "react-modal";
import { useRouter } from "next/router";
import TransactionLoader from "./TransactionLoader";
import styles from "./Main.module.css";
import { ethers } from "ethers";
import { NextPage } from "next";

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
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

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
interface MainProps {
  Account: string;
  CPAMMContract: ethers.Contract | null;
  Provider: ethers.providers.Web3Provider | null;
}

const Liquidity: NextPage<MainProps> = ({
  Account,
  CPAMMContract,
  Provider,
}) => {
  const { formData, handleChange, sendTransaction } =
    useContext(TransactionContext);
  const router = useRouter();

  const [currency1, setCurrency1] = useState();
  const [currency2, setCurrency2] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu1, setShowMenu1] = useState(false);
  const [reserve1, setreserve1] = useState<number | null>();
  const [reserve2, setreserve2] = useState<number | null>();

  // console.log('reserves of Token 1:',reserve1)
  // console.log('Reserves of Token 2:',reserve2)

  const handleSubmit = async (e: any) => {
    const { addressTo, amount } = formData;
    e.preventDefault();

    if (currency1 === currency2) {
      console.error("nikal lavde");
      return;
    }
    console.log(CPAMMContract);

    CPAMMContract?.addLiquidity(Number(amount1), Number(amount2));
  };

  function handleClick() {
    setShowMenu((prev) => {
      return !prev;
    });
  }

  function handleClick1() {
    setShowMenu1((prev) => {
      return !prev;
    });
  }

  useEffect(() => {
    const loadReserves = async () => {
      try {
        console.log(CPAMMContract);

        // Make sure CPAMMContract is defined before accessing its properties
        if (CPAMMContract) {
          let val1 = CPAMMContract.reserve0;
          let val2 = CPAMMContract.reserve1;

          // Make sure val1 and val2 are valid values before setting state

          console.log(val1, val2);
          setreserve1(Number(val1));
          setreserve2(Number(val2));
        } else {
          console.error("CPAMMContract is not defined");
        }
      } catch (error) {
        console.error("Error loading reserves:", error);
      }
    };

    loadReserves();
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>
            Liquidity {reserve1} {reserve2}
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            onChange={(e) => handleChange(e, "amount")}
            onKeyUp={(e) => setamount1(e.target.value)}
          />
          <div className={style.currencySelector} onClick={handleClick1}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <Image src={ethLogo} alt="eth logo" height={20} width={20} />
              </div>
              <div className={style.currencySelectorTicker}>{currency1}</div>
              <AiOutlineDown className={style.currencySelectorArrow} />
            </div>
          </div>
          {showMenu1 && (
            <div
              className={styles.dropdownmenu}
              onClick={() => setShowMenu1(false)}
            >
              <ul>
                <li onClick={() => setCurrency1("ETH")}>ETH</li>
                <li onClick={() => setCurrency1("TKN1")}>Coin 1</li>
                <li onClick={() => setCurrency1("TKN2")}>Coin 2</li>
              </ul>
            </div>
          )}
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
            onChange={(e) => handleChange(e, "addressTo")}
            onKeyUp={(e) => setamount2(e.target.value)}
          />
          <div className={style.currencySelector} onClick={handleClick}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <Image src={ethLogo} alt="eth logo" height={20} width={20} />
              </div>
              <div className={style.currencySelectorTicker}>{currency2}</div>
              <AiOutlineDown className={style.currencySelectorArrow} />
            </div>
          </div>
          {showMenu && (
            <div
              className={styles.dropdownmenu}
              onClick={() => setShowMenu(false)}
            >
              <ul>
                <li onClick={() => setCurrency2("ETH")}>ETH</li>
                <li onClick={() => setCurrency2("TKN1")}>Coin 1</li>
                <li onClick={() => setCurrency2("TKN2")}>Coin 2</li>
              </ul>
            </div>
          )}
        </div>
        <div onClick={(e) => handleSubmit(e)} className={style.confirmButton}>
          Approve
        </div>
      </div>

      <Modal isOpen={!!router.query.loading} style={customStyles}>
        <TransactionLoader />
      </Modal>
    </div>
  );
};

export default Liquidity;
