
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEpisodeById } from "../../store/episodeSlice"; // Предполагается, что у вас есть такой thunk

export const MainEpisodeDetail = () => {
  const { episodeId } = useParams();
  const dispatch = useDispatch();
  const episodeDetails = useSelector((state) => state.episodes.entities.find((e) => e.id === episodeId));


  return (
    <div>
      <h1>{episodeDetails?.name}</h1>
      <p>Episode: {episodeDetails?.episode}</p>
      <p>Air date: {episodeDetails?.air_date}</p>
      <h2>Characters</h2>
    </div>
  );
};
