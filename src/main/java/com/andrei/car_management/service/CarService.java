package com.andrei.car_management.service;

import com.andrei.car_management.model.Car;
import com.andrei.car_management.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

@Service  // Indică faptul că această clasă este un Service
@Validated
public class CarService {

    private final CarRepository carRepository;

    @Autowired  // Injectăm automat repository-ul
    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    // Metodă pentru a obține toate mașinile
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // Metodă pentru a adăuga o mașină nouă
    public Car addCar(Car car) {
        System.out.println("Saving Car: " +car);
        return carRepository.save(car);
    }

    // Metodă pentru a găsi o mașină după ID
    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    // Metodă pentru a șterge o mașină
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}
