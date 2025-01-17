"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./payment.css";
import { Button } from "@/components/shared/Button";
import { getProduct } from "@/libs/services/filterProuctById";
import { useSearchParams } from "next/navigation";
import Alert from "@/components/shared/alert/Alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtocolDefinition from "@/app/auth/ProtocolDefinition";
import Spinner from "@/components/shared/Spinner";

const MakePayment = () => {
  const [web5, setWeb5] = useState<any>(null);
  const [myDid, setMyDid] = useState<any>(null);
  const [productFromCart, setProductFromCart] = useState<any>(null);
  const [isProductLoading, setProductLoading] = useState(false);
  const [isPageLoading, setPageLoading] = useState(false);

  const productId = useSearchParams();
  const id = productId.get("productId");
  const router = useRouter();
  const product = getProduct(id!);

  useEffect(() => {
    const initWeb5 = async () => {
      const { Web5 } = await import("@web5/api");

      try {
        setPageLoading(true);
        const { web5, did } = await Web5.connect();
        console.log(web5);
        setWeb5(web5);
        setMyDid(did);
      } catch (error) {
        console.error("Failed to connect using Web5: ", error);
      } finally {
        setPageLoading(false);
      }
    };

    initWeb5();
  }, []);

  const seeProductFromCart = async (event: any) => {
    event.preventDefault();

    try {
      setProductLoading(true);
      const { records: productRecords } = await web5.dwn.records.query({
        from: myDid,
        message: {
          filter: {
            protocol: ProtocolDefinition.protocol,
            protocolPath: "Product",
          },
        },
      });

      console.log("product records", productRecords);

      const combinedProducts: any[] = [];

      for (let index = 0; index < productRecords.length; index++) {
        const productRecord = productRecords[index];
        const productId = productRecord.id;

        try {
          const { record, status } = await web5.dwn.records.read({
            from: myDid,
            message: {
              filter: {
                recordId: productId,
              },
            },
          });

          console.log("Product Record:", { record, status });

          const productData = await record.data.json();
          console.log("Product Data:", productData);

          // Fetch image records within the try block
          const imageRecordsResponse = await web5.dwn.records.query({
            from: myDid,
            message: {
              filter: {
                protocol: ProtocolDefinition.protocol,
                protocolPath: "Product/Image",
              },
            },
          });

          console.log("Image Records Response:", imageRecordsResponse);

          const imageRecords = imageRecordsResponse.records;

          console.log("Image Records:", imageRecords);

          const images: any[] = [];

          if (Array.isArray(imageRecords)) {
            for (const imageRecord of imageRecords) {
              const imageId = imageRecord.id;
              const { record: image } = await web5.dwn.records.read({
                from: myDid,
                message: {
                  filter: {
                    recordId: imageId,
                  },
                },
              });

              console.log("Image Record:", image);

              const imageData = await image.data.blob();
              images.push(URL.createObjectURL(imageData));
            }
          } else {
            console.error("Image Records is not an array:", imageRecords);
          }

          // Combine product details with images
          const combinedProduct = {
            details: productData,
            images,
          };

          combinedProducts.push(combinedProduct);
        } catch (error) {
          console.error("Error retrieving product details:", error);
        }
      }

      console.log("Combined Products:", combinedProducts);
      // Set state to update the component
      setProductFromCart(combinedProducts);
    } catch (error) {
      console.error("Error retrieving products from cart:", error);
    } finally {
      setProductLoading(false);
    }
  };

  if (product == null) {
    const alert: JSX.Element = (
      <Alert errorMessage="Payment or Product Not found! Navigating to Products page..." />
    );
    setTimeout(() => {
      router.push("/products");
    }, 3000);
    return alert;
  }

  if (isPageLoading) {
    return <Spinner />;
  }
  return (
    <section className="px-4 w-full h-auto flex flex-col items-center justify-between gap-2">
      <h1 className="text-center">PAYMENT METHOD</h1>
      <div className="w-full h-auto flex flex-col items-center justify-between gap-2">
        <div className="w-[100vw] flex-wrap overflow-x-scroll flex  gap-3 items-center justify-center mx-4">
          {isProductLoading ? (
            <Spinner />
          ) : productFromCart && productFromCart.length > 0 ? (
            productFromCart.map((product: any, index: number) => (
              <div
                key={index}
                className="w-[16rem] h-[25rem] flex items-center justify-center gap-5 flex-col mx-3"
              >
                {product.images ? (
                  <img
                    src={product.images[0]}
                    alt={product.details?.ProductName}
                  />
                ) : (
                  <p>No Image Available</p>
                )}
                <div className="w-full flex flex-col items-start justify-start gap-5">
                  <h2 className="capitalize font-bold">
                    {product.details?.ProductName || "Product Name"}
                  </h2>
                  <h4 className="font-[400] ">
                    Price ${product.details?.Price || "0.00"}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            <p>No products in the cart</p>
          )}
        </div>
        <form className="flex flex-col items-center justify-between gap-4 w-full md:w-[38%]">
          <div className="w-full flex justify-between items-center h-fit gap-4">
            <Button
              className="underline -ml-8 text-black"
              label="See Cart"
              link="/cart"
            />
            <Button
              className="bg-accent text-white py-3 px-7 sm:px-4"
              label="Connect Wallet"
            />
          </div>
          <textarea
            className="p-4 mt-4 w-full"
            id="did"
            name="did"
            placeholder="Enter DID"
          ></textarea>
          <button
            className="bg-accent w-full  text-white py-3 px-7 text-center rounded-lg"
            onClick={seeProductFromCart}
          >
            See Product From Cart
          </button>
        </form>
      </div>
    </section>
  );
};

export default MakePayment;
