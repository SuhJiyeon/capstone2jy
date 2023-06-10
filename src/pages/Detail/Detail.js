import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getProductsItem } from "../../apis/board";
import Map from "../../components/Map";
import styles from "./Detail.module.css";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};
const Detail = () => {
  const [showImageURL, setShowImageURL] = useState("")
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [numberToggle, setNumberToggle] = useState(false)
  const handleNumberToggle = () => {
    setNumberToggle(!numberToggle)
  }

  useEffect(() => {
    // console.log(location, "location")

    (async () => {
      const res = await getProductsItem(location.state)
      setProduct(res.data.result.data)
      setShowImageURL(res.data.result.data?.images[0]?.accessUrl)
    })();

  }, [location])

  useEffect(() => {
    console.log(product, "product")
  }, [product])

  const slideContainerRef = useRef(null)




  function translateContainer(direction) {
    const selectedBtn = (direction === 1) ? 'prev' : 'next';
    slideContainerRef.current.style.transitionDuration = '500ms';
    slideContainerRef.current.style.transform = `translateX(${direction * (100 / 5)}%)`;
    slideContainerRef.current.ontransitionend = () => reorganizeEl(selectedBtn);
  }

  function reorganizeEl(selectedBtn) {
    slideContainerRef.current.removeAttribute('style');
    (selectedBtn === 'prev') ? slideContainerRef.current.insertBefore(slideContainerRef.current.lastElementChild, slideContainerRef.current.firstElementChild) : slideContainerRef.current.appendChild(slideContainerRef.current.firstElementChild);
  }

  const handleButtonClick = (type) => {
    if (type === "prev") {
      translateContainer(1)
    } else {
      translateContainer(-1)
    }
  }

  const handleSlideItemCLick = (item) => {
    setShowImageURL(item.accessUrl)
  }
  return (
    <div className={styles.Layout}>
      {/* <h1>Detail</h1> */}
      <div className={styles.Section}>
        <div className={styles.SectionContentBox}>
          <div className={styles.LeftBox}>
            <div className={styles.ImageBox}>
              <img src={showImageURL} width={"100%"} height={"100%"} />
            </div>
            {product?.images?.length > 1 &&
              <div className={styles.ImageSlideWrapper}>
                <div className={styles.SlideContainer} ref={slideContainerRef}>
                  {product?.images?.map((item) => {
                    return (
                      <div className={styles.SlideItem} onClick={() => handleSlideItemCLick(item)}>
                        <img width={100} height={100} src={item?.accessUrl} />
                      </div>
                    )
                  })}
                </div>




                <div className={styles.ButtonContainer}>
                  <div className={styles.SlideArrowButton} onClick={() => handleButtonClick("prev")}>

                    <IoIosArrowBack size={30} />
                  </div>
                  <div className={styles.SlideArrowButton} onClick={() => handleButtonClick("next")}>
                    <IoIosArrowForward size={30} />
                  </div>
                </div>

              </div>

            }


          </div>
          <div className={styles.RightBox}>
            <div className={styles.Category}>{product?.category}</div>
            <div className={styles.ItemName}>{product?.itemName}</div>
            <div className={styles.Line}></div>
            <div className={styles.ItemInfo}>
              <div className={styles.ItemTitle}>
                {product?.title}
                
              </div>
              <div className={styles?.ItemDesc}>
                {product?.content}
                

              </div>
            </div>
            <div className={styles.Line}></div>
            <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>카테고리</div>
            <div className={styles.Categories}>
              <span className={styles.Item}>{product?.category}</span>
              <span>{">"}</span>
              <span className={styles.Item}>{product?.subCategory}</span>
              <span>{">"}</span>
              <span className={styles.Item}>{product?.leafCategory}</span>


            </div>
            <div className={styles.Line}></div>
            <button className={styles.CheckNumber} onClick={handleNumberToggle}>
              {numberToggle ? "시리얼 넘버 숨기기" : "시리얼 넘버 확인"}
            </button>
            {numberToggle && <div className={styles.NumberView}>시리얼 넘버: {product?.serialNumber}</div>}
          </div>
        </div>

      </div>


      <div className={styles.Section}>
        <div className={styles.MapTitle}>대략적인 분실 위치</div>
        <Map viewType={"read-only"} location={{ latitude: product?.latitude, longtitude: product?.longitude }}></Map>
      </div>

    </div>
  )
}

export default Detail