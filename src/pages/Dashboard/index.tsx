import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food, FoodProps } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export function Dashboard() {
  const [foods, foodsSet] = useState<FoodProps[]>([])
  const [editingFood, editingFoodSet] = useState<FoodProps>({} as FoodProps)
  const [modalOpen, modalOpenSet] = useState(false)
  const [editModalOpen, editModalOpenSet] = useState(false)

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get('/foods');
      foodsSet(response.data)
    }
    getFoods()
  }, [])

  const handleAddFood = async (food: FoodProps) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      foodsSet([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodProps) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      foodsSet(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: string) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    foodsSet(foodsFiltered);
  }

  const toggleModal = () => {
    modalOpenSet(!modalOpen);
  }

  const toggleEditModal = () => {
    editModalOpenSet(!editModalOpen);
  }

  const handleEditFood = (food: FoodProps) => {
    editingFoodSet(food)
    editModalOpenSet(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
