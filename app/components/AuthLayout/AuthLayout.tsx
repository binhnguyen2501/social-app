import React, { ReactNode } from "react";

import styles from "./AuthLayout.module.scss";

interface IProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: IProps) {
  return (
    <div className="flex md:h-screen md:py-0 py-14">
      <div className="m-auto bg-slate-100 xl:w-3/5 lg:w-5/6 md:w-3/4 w-4/5 lg:h-3/4 h-4/5 grid lg:grid-cols-2 grid-cols-1 rounded-xl overflow-hidden">
        <div className="relative overflow-hidden lg:h-full md:h-68 h-48">
          <div
            className={`${styles.context} px-10 text-[20px] md:text-[30px] xl:text-[40px]`}
          >
            <h1 className="font-semibold">
              It's a place for us to talk anythings
            </h1>
          </div>
          <div className={styles.area}>
            <ul className={styles.circles}>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="right flex flex-col justify-evenly bg-slate-100 overflow-y-auto">
          <div className="text-center py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
