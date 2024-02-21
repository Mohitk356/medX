"use client";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../redux/hooks";
import { getUserData, getUserTransactions, getWalletInfo } from "../../utils/databaseService";
import moment from "moment";

export default function MyWallet({ userdata }) {
  const { currRate, currency } = useAppSelector(
    (state: any) => state.appReducer
  );

  const { data: walletInfo } = useQuery({
    queryKey: ["walletInfo"],
    queryFn: () => getWalletInfo(),
    keepPreviousData: true,
  });

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(null),
    keepPreviousData: true,
  });

  const { data: userTransactions } = useQuery({
    queryKey: ["userTransactions"],
    queryFn: () => getUserTransactions(userData?.id),
    enabled: !!userData,
  });

  return (
    <div className="flex flex-col gap-4 md:gap-10 lg:gap-16">
      <div className="flex flex-col">
        {userData !== null && (
          <>
            <h1 className="text-2xl lg:text-3xl font-semibold">My Cashbacks</h1>{" "}
            <div className="flex gap-2 mt-3">
              <div className="p-4 bg-slate-100 rounded-md shadow-md">
                <p>
                  Cashback : {currency}{" "}
                  {(userData && userData?.wallet?.cashback * currRate).toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col mt-5">
          <h3 className="font-semibold text-lg lg:text-xl">Conditions Applied:</h3>
          <div className="">
            <ol>
              <li>1. Minimum order value to avail cashback is {(walletInfo?.minOrderAmnt * currRate).toFixed(2)} {currency}</li>
              <li>2. Minimum amount can be used from cashback in an order is {(walletInfo?.maxWalletAmntPerOrder * currRate).toFixed(2)} {currency}</li>
              <li>3. Amount as cashback for new users is {(walletInfo?.newUserWalletAmnt * currRate).toFixed(2)} {currency}</li>
            </ol>
          </div>
        </div>
        {userTransactions && userTransactions?.length !== 0 && (
          <>
            <h2 className="mt-7 font-semibold text-2xl lg:text-3xl">
              Transaction History
            </h2>
            <div className=" overflow-auto flex flex-col max-h-[50vh] mt-4 gap-3 border border-gray-300 rounded-md">
              {userTransactions?.map((transaction) => {
                return (
                  <div
                    key={transaction?.id}
                    className="flex justify-between items-center shadow-md  px-3 py-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex flex-col justify-center items-start gap-1">
                      <p className="font-medium">{transaction?.message}</p>
                      <p className="text-xs">
                        on{" "}
                        {moment(transaction?.createdAt?.toDate()).format(
                          "DD MMM, yyyy"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <p>
                        {currency} {(transaction?.amount * currRate).toFixed(2)}
                      </p>
                      <p
                        className={`capitalize ${
                          transaction?.type === "credit"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction?.type}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
