import { Header } from "../../components/Header";
import api from "../../services/api";

import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect, useState } from "react";
import { Food } from "../../models";
import { FoodComponent } from "../../components/FoodComponent";

export default function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api
      .get("/foods")
      .then((response) => {
        setFoods(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAddFood = async (food: Food) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods([...foods, response.data])
    } catch (error){
      console.error(error)
    }

    
  };

  const handleUpdateFood = async (food: Food) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFood = async (foodId: number) => {
    await api.delete(`/foods/${foodId}`);

    const foodsFiltered = foods.filter((food) => food.id !== foodId);

    setFoods(foodsFiltered);
  };

  const handleOpenModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: Food) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={handleOpenModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={handleOpenModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={handleOpenEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodComponent
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
