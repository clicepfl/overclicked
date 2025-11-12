"use client";

import OrderStatus from "@/components/OrderStatus";
import {
  getMenus,
  getOrders,
  markAsPrepared,
  markAsServed,
  Menu,
  Order,
} from "@/data";
import { delay } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home({
  params,
}: {
  params: Promise<{ password: string }>;
}) {
  const [orders, setOrders] = useState([] as Order[]);
  const [menus, setMenus] = useState([] as Menu[]);

  useEffect(() => {
    let fetch = true;
    let fn = async () => {
      while (fetch) {
        setOrders(await getOrders());
        setMenus(await getMenus());
        await delay(1000);
      }
    };

    fn();

    return () => {
      fetch = false;
    };
  }, []);

  return (
    <div className="admin">
      <span className="button-span">
        <h1>Subsonic Catering</h1>
        <Link href="./admin/preparation">Preparation</Link>
      </span>
      <div className="stats">
        <div className="stat purple">
          <h2>Total</h2>
          <p>{orders.length} Orders</p>
          <p>
            {orders.reduce((acc, o) => {
              return acc + o.amounts.reduce((acc, a) => acc + a, 0);
            }, 0)}{" "}
            Croques
          </p>
        </div>
        <div className="stat purple">
          <h2>Prepared</h2>
          <p>{orders.filter((o) => o.prepared).length} Orders</p>
          <p>
            {orders
              .filter((o) => o.prepared)
              .reduce((acc, o) => {
                return acc + o.amounts.reduce((acc, a) => acc + a, 0);
              }, 0)}{" "}
            Croques
          </p>
        </div>
        <div className="stat purple">
          <h2>Served</h2>
          <p>{orders.filter((o) => o.served).length} Orders</p>
          <p>
            {orders
              .filter((o) => o.served)
              .reduce((acc, o) => {
                return acc + o.amounts.reduce((acc, a) => acc + a, 0);
              }, 0)}{" "}
            Croques
          </p>
        </div>
      </div>
      <div className="stats">
        {menus.map((m, i) => (
          <div key={i} className="stat">
            <h2>{m.name}</h2>
            <p>{orders.reduce((acc, o) => acc + o.amounts[i], 0)} Ordered</p>
            <p>{m.stocks} Remaining</p>
          </div>
        ))}
      </div>
      <div className="stats">
        {orders
          .reduce((acc, o) => {
            if (!acc.includes(o.register)) {
              acc.push(o.register);
            }
            return acc;
          }, [] as string[])
          .sort()
          .map((r, i) => (
            <div key={i} className="stat orange">
              <h2>Register {r}</h2>
              <p>{orders.filter((o) => o.register === r).length} Orders</p>{" "}
              <p>
                {orders
                  .filter((o) => o.register === r)
                  .reduce((acc, o) => {
                    return acc + o.amounts.reduce((acc, a) => acc + a, 0);
                  }, 0)}{" "}
                Croques Sold
              </p>
              <span className="button-span">
                <a href={`/${r}`}>Register</a>
                <a href={`/${r}/public`}>Public</a>
              </span>
            </div>
          ))}
      </div>
      <div className="orders">
        {menus.length == 0 ? (
          <></>
        ) : (
          orders
            .sort((a, b) => b.id - a.id)
            .map((o) => (
              <OrderStatus
                key={o.id}
                menuItems={menus}
                order={o}
                showDetails={false}
                showRegister={true}
                archived={o.served}
                statusIcon={o.served ? "✅" : o.prepared ? "🥪" : "⏳"}
                actionAvailable={!o.served || !o.prepared}
                buttonText={"Prepared & Served"}
                buttonAction={() => {
                  markAsPrepared(o.id);
                  markAsServed(o.id);
                }}
              />
            ))
        )}
      </div>
    </div>
  );
}
