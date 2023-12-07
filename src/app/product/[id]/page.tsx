"use client";

// @ts-ignore
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
// @ts-ignore
import { useParams } from "next/navigation";
import React from "react";

const ProductDetail = (): JSX.Element => {
  const params: Params = useParams();
  return <div>Product Id: {params.id}</div>;
};

export default ProductDetail;
