"use client";

import { Slide } from "react-toastify";
import MenuSelect from "@/components/MenuSelect";
import OrderStatus from "@/components/OrderStatus";
import {
  addOrder,
  Order,
  getOrders,
  markAsServed,
  Menu,
  getMenus,
  cancelOrder,
  markAsNotServed,
} from "@/data";
import { delay } from "@/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Page() {
  const params = useParams();
  const register = params["register"] as string;
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

  const [currentOrder, setCurrentOrder] = useState(new Array(4).fill(0));

  const activeOrders = orders.filter(
    (o) => o.register === register && !o.canceled
  );

  const readyToServeOrders = activeOrders
    .filter((o) => o.prepared || o.served)
    .sort((a, b) => {
      if (a.served !== b.served) return a.served ? 1 : -1;
      return b.id - a.id;
    });

  const inPreparationOrders = activeOrders
    .filter((o) => !o.prepared && !o.served)
    .sort((a, b) => b.id - a.id);

  return (
    <>
      <div className="register">
        <div className="register-select">
          <div className="menu-selections">
            {menus.map((m, i) => (
              <MenuSelect
                key={i}
                menu={m}
                numSelects={currentOrder[i]}
                remaining={m.stocks}
                addSelect={() => {
                  const newOrder = [...currentOrder];
                  newOrder[i] += 1;
                  setCurrentOrder(newOrder);
                }}
                removeSelect={() => {
                  const newOrder = [...currentOrder];
                  newOrder[i] -= 1;
                  setCurrentOrder(newOrder);
                }}
              />
            ))}
          </div>
          <button
            onClick={async () => {
              try {
                const totalItems = currentOrder.reduce(
                  (sum, count) => sum + count,
                  0
                );
                if (totalItems === 0) {
                  toast.warning(
                    "Cannot send an empty order.",
                    {
                      autoClose: 1500,
                      closeButton: false,
                    }
                  );
                  return;
                }

                await addOrder(currentOrder, register);
                toast.success("Order sent!", {
                  autoClose: 1500,
                  closeButton: false,
                });
              } catch {
                toast.error("Error: no more stocks for selected items", {
                  autoClose: false,
                  closeButton: true,
                });
              }
              setCurrentOrder(new Array(menus.length).fill(0));
            }}
          >
            Send Order
          </button>
        </div>
        <div className="register-orders">
          <h1>Register {register}</h1>

          <Link className="admin-button" href="/">
            Admin
          </Link>

          <div className="register-orders-cols">
            <div className="register-orders-col">
              <h2>In Preparation</h2>
              {menus.length == 0 ? (
                <></>
              ) : (
                inPreparationOrders.map((o) => (
                  <RegisterOrderStatus key={o.id} o={o} menus={menus} />
                ))
              )}
            </div>
            <div className="register-orders-col">
              <h2>Ready to Serve</h2>
              {menus.length == 0 ? (
                <></>
              ) : (
                readyToServeOrders.map((o) => (
                  <RegisterOrderStatus key={o.id} o={o} menus={menus} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        closeButton={ToastCloseButton}
        transition={Slide}
        position="top-center"
      />
    </>
  );
}

function RegisterOrderStatus({ o, menus }: { o: Order; menus: Menu[] }) {
  return (
    <OrderStatus
      key={o.id}
      menuItems={menus}
      order={o}
      buttonText={o.served ? "Undo Serve" : o.prepared ? "Serve" : "Cancel"}
      buttonAction={
        o.served
          ? markAsNotServed
          : o.prepared
          ? markAsServed
          : (id: number) => {
              toast.warning("Are you sure you want to cancel this order?", {
                autoClose: false,
                closeButton: true,
                onClose: (closedByUser) => {
                  if (closedByUser) {
                    cancelOrder(id);
                    setTimeout(() => {
                      toast.success("Order canceled.", {
                        autoClose: 1500,
                        closeButton: false,
                      });
                    }, 600);
                  }
                },
              });
            }
      }
      actionAvailable={true}
      actionIsDanger={!o.prepared && !o.served}
      showDetails={false}
      showRegister={false}
      archived={o.served}
      statusIcon={o.served ? "✅" : o.prepared ? "🥪❗" : "⏳"}
    />
  );
}

const ToastCloseButton = ({ closeToast }: { closeToast: () => void }) => (
  <button className="danger" onClick={closeToast}>
    OK
  </button>
);
