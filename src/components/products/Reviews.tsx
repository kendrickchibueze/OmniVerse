"use client";

import React, { Component } from "react";
import Image from "next/image";
import { ReviewData } from "../../libs/data/products/product.review";
import Slider from "react-slick";

export default class Reviews extends Component {
  constructor(props: any) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  slider: any;
  next(): void {
    this.slider!.slickNext();
  }
  previous(): void {
    this.slider!.slickPrev();
  }

  render() {
    const settings = {
      className: "flex items-center justify-between w-full",
      dots: true,
      draggable: true,
      infinite: true,
      autoPlay: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,
      pauseOnHover: true,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <section className="my-5 h-[70vh] p-3">
        <div className="flex justify-between items-center w-full h-[4rem] my-4">
          <h1 className="align-left font-bold text-[2rem] my-8">
            OUR HAPPY CUSTOMERS
          </h1>
          <div className="flex w-[4rem] items-center justify-between">
            <Image
              onClick={this.previous}
              className="cursor-pointer"
              src="/svg/arrow-left.svg"
              alt="Previous"
              width={24}
              height={24}
            />
            <Image
              onClick={this.next}
              className="cursor-pointer"
              src="/svg/arrow-right.svg"
              alt="Next"
              width={24}
              height={24}
            />
          </div>
        </div>
        <Slider ref={(c: any) => (this.slider = c)} {...settings}>
          {ReviewData &&
            ReviewData.map((review) => (
              <div
                className="w-[390px] h-[220px] p-6 border border-black border-opacity-10 justify-evenly items-start inline-flex rounded-[1.25rem] "
                key={review.id}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-between">
                    {review.stars.map((star) => (
                      <Image
                        key={star.key}
                        src={star.value}
                        width={23}
                        height={21}
                        alt="Stars"
                      />
                    ))}
                  </div>
                  <div className="flex items-center">
                    <p className="font-bold text-lg">{review.userName}</p>
                    <Image
                      src={review.userImage}
                      width={24}
                      height={24}
                      alt={review.userName}
                    />
                  </div>
                  <span className="text-black text-opacity-60 text-base font-normal font-['Satoshi'] leading-snug">
                    &quot;{review.reviewText}&quot;
                  </span>
                </div>
              </div>
            ))}
        </Slider>
      </section>
    );
  }
}