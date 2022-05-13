// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

#pragma once

#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <array>
#include <algorithm>
#include <optional>
#include <fstream>
#include <numeric>
#include <cassert>

#include <boost/asio/io_context.hpp>
#include <boost/archive/binary_iarchive.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/serialization/vector.hpp>
#include <boost/serialization/array.hpp>
#include <boost/serialization/unique_ptr.hpp>
#include <boost/serialization/access.hpp>

#include "npkcalc.hpp"

struct ElementTmp {
	npkcalc::ELEMENT element;
	double mass_part;
};

namespace boost::serialization {
template<typename Archive>
void serialize(Archive& ar, ElementTmp& el, const unsigned int) {
	ar& el.element;
	ar& el.mass_part;
}

template<class Archive>
void serialize(Archive& ar, npkcalc::TargetElement& el, const unsigned int) {
	ar& el.value;
	ar& el.value_base;
	ar& el.ratio;
}

template<class Archive>
void serialize(Archive& ar, npkcalc::Solution& x, const unsigned int) {
	ar& x.id;
	ar& x.name;
	ar& x.owner;
	ar& x.elements;
}

template<class Archive>
void serialize(Archive& ar, npkcalc::Fertilizer& x, const unsigned int file_version) {
	ar& x.id;
	ar& x.name;
	ar& x.owner;
	ar& x.formula;
}
template<class Archive>
void serialize(Archive& ar, npkcalc::Calculation& x, const unsigned int) {
	ar& x.id;
	ar& x.name;
	ar& x.elements;
	ar& x.fertilizers_ids;
	ar& x.volume;
	ar& x.mode;
}
} // namespace boost::serialization

namespace che {

class Table {
public:
	virtual ~Table() = default;
	virtual bool load() noexcept = 0;
	virtual void store() noexcept = 0;
};

template<class T>
class SerializibleIdVector : public Table {
	friend boost::serialization::access;
	template<class Archive>
	void serialize(Archive& ar, const int /*file_version*/) {
		ar& last_id_;
		ar& data_;
	}

	int last_id_ = 0;
	using container = std::vector<std::unique_ptr<T>>;
	using iterator = typename container::iterator;
	container data_;
	const std::string table_name_;

	void store_(const std::string& table_name) const noexcept {
		try {
			std::ofstream os(table_name, std::ios_base::binary);
			boost::archive::binary_oarchive ar(os, boost::archive::no_header | boost::archive::no_tracking);
			ar << *this;
		} catch (std::exception& ex) {
			std::cout << ex.what() << std::endl;
		}
	}

public:
	auto& data() { return data_; }
	
	T* create() {
		data_.push_back(std::make_unique<T>());
		data_.back()->id = last_id_++;
		return data_.back().get();
	}

	T* get_by_id(int id) noexcept {
		auto it = std::find_if(data_.begin(), data_.end(), [id](const auto& x) {
			return x->id == id;
			});
		return (it == data_.end() ? nullptr : (*it).get());
	}

	void remove_by_id(int id) {
		auto founded = std::find_if(data_.begin(), data_.end(), [id](const auto& x) {
			return x->id == id;
			});
		if (founded != data_.end()) data_.erase(founded);
	}

	T* clone(const T* item) noexcept {
		int id = last_id_++;
		auto ptr = std::make_unique<T>(id);
		*ptr.get() = *item;
		ptr->SetName(ptr->GetName() + " - Copy");
		data_.emplace_back(std::move(ptr));
		return (*std::prev(data_.end())).get();
	}

	auto size() const noexcept { return static_cast<int>(data_.size()); }

	std::unique_ptr<T>& operator[](int ix) noexcept {
		return data_[ix];
	}

	void sort() noexcept {
		std::sort(data_.begin(), data_.end(), [](const auto& a, const auto& b) {
			return a->name < b->name;
			});
	}
	auto begin() noexcept { return data_.begin(); }
	auto end() noexcept { return data_.end(); }

	auto begin() const noexcept { return data_.begin(); }
	auto end() const noexcept { return data_.end(); }

	void clear() { data_.clear(); }

	virtual bool load() noexcept {
		assert(table_name_.length() > 0);
		try {
			std::ifstream is(table_name_, std::ios_base::binary);
			boost::archive::binary_iarchive ar(is, boost::archive::no_header | boost::archive::no_tracking);
			ar >> *this;
			return true;
		} catch (std::exception& ex) {
			std::cout << ex.what() << std::endl;
			clear();
		}
		return false;
	}

	virtual void store() noexcept {
		assert(table_name_.length() > 0);
		store_(table_name_);
	}

	void store(const std::string& table_name) const noexcept {
		store_(table_name);
	}

	SerializibleIdVector() = default;
	SerializibleIdVector(std::string_view table_name)
		: table_name_(table_name)
	{
	}
};

} // namespace che

BOOST_CLASS_VERSION(npkcalc::Solution, 1);
BOOST_CLASS_VERSION(npkcalc::Fertilizer, 30);
BOOST_CLASS_VERSION(npkcalc::Calculation, 1);

using Solutions = che::SerializibleIdVector<npkcalc::Solution>;
using Fertilizers = che::SerializibleIdVector<npkcalc::Fertilizer>;
using Calculations = che::SerializibleIdVector<npkcalc::Calculation>;