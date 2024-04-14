import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import styles from "./Workout.module.css"; // CSSモジュールのインポート
import React, { useState } from "react";
import WorkoutPopup from "./WorkoutPopup";
// ResetSelectedWorkoutをインポート
import { ResetSelectedWorkout } from "./workoutSlice";
const Workout = () => {
  const trainingOptions = [
    { id: 1, Name: "スクワット" },
    { id: 2, Name: "ベンチプレス" },
    { id: 3, Name: "デッドリフト" },
    { id: 4, Name: "プルアップ" },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [trainingMenu, setTrainingMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");
  const selectedWorkout = useSelector(
    (state: RootState) => state.selectedWorkout.selectedWorkout
  );
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // state.SelectedWorkoutから新しいメニューを取得してselectedWorkoutに追加
  };

  // const Reset = () => {
  //   ResetSelectedWorkout();
  // };

  return (
    <div>
      {/* <Button variant="contained" onClick={Reset}>
        Reset
      </Button> */}
      <div>
        <h1>Workout</h1>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Training Menu
        </Button>
        {/* トレーニングメニューが選択されていない場合 */}
        {selectedWorkout.length === 0 ? (
          <p>トレーニングメニューを選択してください</p>
        ) : (
          selectedWorkout.map((workout, index) => (
            <div key={workout.Menu}>
              <h3>{workout.Menu}</h3>
              {/* <TextField label="メモ" value={menu.notes} />
                <TextField label="重量" type="number" value={menu.weight} />
                <FormControl>
                  <InputLabel>回数</InputLabel>
                  <Select value={menu.reps}>
                    {[...Array(100).keys()].map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
              <Button variant="contained">Add Set</Button>
              <Button variant="contained" color="secondary">
                Delete Set
              </Button>
            </div>
          ))
        )}
        <Modal open={openModal} onClose={handleCloseModal}>
          <WorkoutPopup open={openModal} onClose={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
};

export default Workout;
