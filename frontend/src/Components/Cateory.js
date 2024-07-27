import React, { useEffect } from 'react';
import styles from "../Css/Category.module.css";
import classNames from "classnames/bind";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const cx = classNames.bind(styles);

const Category = () => {
  const params = useParams();
  const id = params.id;
  const round = params.round;

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get(`/favorite/${id}/${round}`);
        console.log(res.data)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getCategory();
  }, []);

  return (
    <div>
      안녕
    </div>
  );
};

export default Category;