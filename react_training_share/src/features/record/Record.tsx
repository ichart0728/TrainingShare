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
import styles from "./Record.module.css"; // CSSモジュールのインポート
import React, { useState } from "react";

const TrainingRecordScreen = () => {
  // const selectedTrainingMenu = useSelector(
  //   (state: RootState) => state.menu.menu
  // );

  const [openModal, setOpenModal] = useState(false);
  const [trainingMenu, setTrainingMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");

  const trainingOptions = [
    "スクワット",
    "ベンチプレス",
    "デッドリフト",
    "プルアップ",
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMenuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMenu(event.target.value);
  };

  const handleAddTraining = () => {
    setSelectedMenu("");
    setWeight("");
    setReps("");
    setNotes("");
    setOpenModal(false);
  };

  return (
    <div>
      <div>
        <h1>トレーニング記録画面</h1>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          トレーニングを追加する
        </Button>
        {trainingMenu.map((menu, index) => (
          <div key={index}>
            {/* <h3>{menu.name}</h3> */}
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
            <Button variant="contained">セット追加</Button>
            <Button variant="contained" color="secondary">
              セット削除
            </Button>
          </div>
        ))}

        <Modal open={openModal} onClose={handleCloseModal}>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2>トレーニングを追加</h2>
            <FormControl fullWidth>
              <InputLabel>トレーニングメニュー</InputLabel>
              {/* <Select value={selectedMenu} onChange={handleMenuChange}>
              {trainingOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select> */}
            </FormControl>
            <TextField
              label="重量"
              type="number"
              fullWidth
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <TextField
              label="回数"
              type="number"
              fullWidth
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
            <TextField
              label="メモ"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTraining}
            >
              追加
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TrainingRecordScreen;
