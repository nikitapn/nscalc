#pragma once

#include <iostream>

#include "idl/nscalc.hpp"
#include "services/client/DataObserver.hpp"
#include "services/db/UserService.hpp"
#include "services/db/FertilizerService.hpp"
#include "services/db/SolutionService.hpp"
#include "services/db/CalculationService.hpp"
#include "services/client/DataObserver.hpp"


class RegisteredUser
  : public nscalc::IRegisteredUser_Servant {
  const UserService::User& user_;
  std::shared_ptr<SolutionService> solutionService_;
  std::shared_ptr<FertilizerService> fertilizerService_;
  std::shared_ptr<CalculationService> calculationService_;
  std::shared_ptr<DataObservers> dataObservers_;

  nscalc::Fertilizer* get_fertilizer(std::uint32_t id) {
    //auto item = data_manager->get<Fertilizers>().get_by_id(id);
    //if (item && item->owner != user_data_.user_name) {
    //  observers.alarm(nscalc::AlarmType::Critical, user_data_.user_name + " is fiddeling with \"" + item->name +
    //                                                   "\": please report this incident to the authority");
    //  throw nscalc::PermissionViolation{"You don't have rights to fiddle with this fertilizer."};
    //}
    //return item;
    return nullptr;
  }

public:
  virtual void GetMyCalculations(
      /*out*/ ::nprpc::flat::Vector_Direct2<nscalc::flat::Calculation, nscalc::flat::Calculation_Direct> calculations) {
    auto data = calculationService_->getAll(user_.id);
    nscalc::helper::assign_from_cpp_GetMyCalculations_calculations(calculations, data);
  }

  // Solutions

  virtual uint32_t AddSolution(::nprpc::flat::Span<char> name, ::nprpc::flat::Span<double> elements) {
    if (elements.size() != nscalc::TARGET_ELEMENT_COUNT) {
      throw nscalc::InvalidArgument{"elements.size() != TARGET_ELEMENT_COUNT"};
    }
    std::string stname = (std::string)name;
    auto id = solutionService_->addSolution(user_.id, stname, elements);
    dataObservers_->alarm(nscalc::AlarmType::Info, user_.user_name + " added solution \"" + stname + "\"");
    return id;
  }

  virtual void SetSolutionName(uint32_t id, ::nprpc::flat::Span<char> name) {
    solutionService_->updateSolutionName(id, user_.id, (std::string)name);
  }

  virtual void SetSolutionElements(uint32_t id, ::nprpc::flat::Span_ref<nscalc::flat::SolutionElement, nscalc::flat::SolutionElement_Direct> elementsToUpdate) {
    solutionService_->updateSolutionElements(id, user_.id, elementsToUpdate);
  }

  virtual void DeleteSolution(uint32_t id) {
    auto solution = solutionService_->getSolution(id);
    if (!solution)
      return;

    if (solution->userId != user_.id) {
      dataObservers_->alarm(nscalc::AlarmType::Critical, user_.user_name + " is fiddeling with \"" + solution->name +
        "\": please report this incident to the authority");
      throw nscalc::PermissionViolation{"You don't have rights to fiddle with this solution."};
    }

    if (solutionService_->deleteSolution(id, user_.id)) {
      dataObservers_->alarm(nscalc::AlarmType::Info, user_.user_name + " has deleted solution \"" + solution->name + "\"");
    }
  }

  // Fertilizers

  virtual uint32_t AddFertilizer(::nprpc::flat::Span<char> name, ::nprpc::flat::Span<char> formula) {
    //std::lock_guard<Fertilizers> lk(data_manager->get<Fertilizers>());

    //auto f = data_manager->get<Fertilizers>().create();
    //f->name = name;
    //f->owner = user_data_.user_name;
    //f->formula = formula;
    //return f->id;
    return 0;
  }

  virtual void SetFertilizerName(uint32_t id, ::nprpc::flat::Span<char> name) {
    //std::lock_guard<Fertilizers> lk(data_manager->get<Fertilizers>());

    //if (auto item = get_fertilizer(id); item) {
    //  item->name = (std::string_view)name;
    //} else {
    //  std::cerr << "fertilizer with id = " << id << " was not found..\n";
    //}
  }

  virtual void SetFertilizerFormula(uint32_t id, ::nprpc::flat::Span<char> name) {
    //std::lock_guard<Fertilizers> lk(data_manager->get<Fertilizers>());

    //if (auto item = get_fertilizer(id); item) {
    //  item->formula = name;
    //} else {
    //  std::cerr << "fertilizer with id = " << id << " was not found..\n";
    //}
  }

  virtual void DeleteFertilizer(uint32_t id) {
    //std::string name;
    //bool deleted = false;
    //{
    //  std::lock_guard<Fertilizers> lk(data_manager->get<Fertilizers>());

    //  if (auto item = get_fertilizer(id); item) {
    //    deleted = true;
    //    data_manager->get<Fertilizers>().remove_by_id(id);
    //  }
    //}
    //if (deleted) {
    ///  observers.alarm(nscalc::AlarmType::Info, user_data().user_name + " has deleted fertilizer \"" + name + "\"");
    //}
  }

  // Solutions

  virtual uint32_t UpdateCalculation(nscalc::flat::Calculation_Direct calculation) {

    //uint32_t id = calculation.id();
    //{
    //  std::lock_guard<Calculations> lk(*calculations);

    //  nscalc::Calculation* calc = calculations->get_by_id(id);

    //  if (!calc) {
    //    calc = calculations->create();
     //   id = calculation.id() = calc->id;
     // }

     // nscalc::helper::assign_from_flat_UpdateCalculation_calculation(calculation, *calc);
    //}

    //calculations->store();

    //return id;
    return 0;
  }

  virtual void DeleteCalculation(uint32_t id) {
    //{
    //  std::lock_guard<Calculations> lk(*calculations);
    //  calculations->remove_by_id(id);
    //}
    //calculations->store();
  }

  virtual void SaveData() {
    //data_manager->get<Solutions>().store();
    //data_manager->get<Fertilizers>().store();
  }

  RegisteredUser(
    const UserService::User& user,
    std::shared_ptr<SolutionService> solutionService,
    std::shared_ptr<FertilizerService> fertilizerService,
    std::shared_ptr<CalculationService> calculationService,
    std::shared_ptr<DataObservers> dataObservers)
      : user_{user}
      , solutionService_{solutionService}
      , fertilizerService_{fertilizerService}
      , calculationService_{calculationService}
      , dataObservers_{dataObservers}
  {
  }

  ~RegisteredUser() {
    std::cerr << "~RegisteredUser()\n";
  }
};