// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <fstream>
#include <cassert>
#include <atomic>
#include <mutex>
#include <boost/archive/binary_iarchive.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/serialization/vector.hpp>
#include <boost/serialization/array.hpp>
#include <boost/serialization/unique_ptr.hpp>
#include <boost/serialization/access.hpp>
#include "idl/nscalc.hpp"

template<class T>
class SerializibleIdVector  {
	using container = std::vector<std::unique_ptr<T>>;
	using iterator = typename container::iterator;

	const std::string table_name_;
	
	int last_id_ = 0;
	container data_;

	friend boost::serialization::access;
	template<class Archive>
	void serialize(Archive& ar, const int /*file_version*/) {
		ar & last_id_;
		ar & data_;
	}
	
	mutable std::mutex mutex_;
	std::atomic_bool changed_ = false;
public:
	T* create() {
		data_.push_back(std::make_unique<T>());
		data_.back()->id = last_id_++;
		changed_.store(true);
		return data_.back().get();
	}

	T* get_by_id(int id) noexcept {
		if (auto it = std::find_if(data_.begin(), data_.end(), [id](const auto& x) { return x->id == id; }); it != data_.end()) {
			changed_.store(true);
			return (*it).get();
		} 
		return nullptr; 
	}

	const T* get_by_id(int id) const noexcept {
		if (auto it = std::find_if(data_.begin(), data_.end(), [id](const auto& x) { return x->id == id; }); it != data_.end()) {
			return (*it).get();
		}
		return nullptr;
	}

	void remove_by_id(int id) {
		if (auto it = std::find_if(data_.begin(), data_.end(), [id](const auto& x) { return x->id == id; }); it != data_.end()) {
			data_.erase(it);
			changed_.store(true);
		}
	}

	void lock() const noexcept { mutex_.lock(); }
	void unlock() const noexcept { mutex_.unlock(); }
	auto& data() { return data_; }
	void sort() noexcept { std::sort(data_.begin(), data_.end(), [](const auto& a, const auto& b) { return a->name < b->name; }); }
	void clear() { data_.clear(); }
	auto begin() noexcept { changed_.store(true); return data_.begin(); }
	auto end() noexcept { return data_.end(); }
	auto begin() const noexcept { return data_.begin(); }
	auto end() const noexcept { return data_.end(); }

	bool load() noexcept {
		assert(table_name_.length() > 0);
		
		bool ok = false;

		try {
			std::ifstream is(table_name_, std::ios_base::binary);
			boost::archive::binary_iarchive ar(is, boost::archive::no_header | boost::archive::no_tracking);
			ar >> *this;
			ok = true;
		} catch (std::exception& ex) {
			std::cerr << ex.what() << '\n';
			clear();
		}

		changed_ = false;

		return ok;
	}

	void store() noexcept {
		assert(table_name_.length() > 0);

		bool expected = true;
		if (changed_.compare_exchange_strong(expected, false)) {
			assert(table_name_.length() > 0);
			std::lock_guard<std::mutex> lk(mutex_);
			try {
				std::ofstream os(table_name_, std::ios_base::binary);
				boost::archive::binary_oarchive ar(os, boost::archive::no_header | boost::archive::no_tracking);
				ar << *this;
			} catch (std::exception& ex) {
				std::cerr << ex.what() << '\n';
			}
		}
	}

	SerializibleIdVector() = default;
	SerializibleIdVector(std::string_view table_name)
		: table_name_(table_name) {}
	SerializibleIdVector(std::string&& table_name)
		: table_name_{std::move(table_name)} {}
};

namespace boost::serialization {

template<class Archive>
void serialize(Archive& ar, nscalc::Solution& x, const unsigned int) {
	ar& x.id;
	ar& x.name;
	ar& x.owner;
	ar& x.elements;
}

template<class Archive>
void serialize(Archive& ar, nscalc::Fertilizer& x, const unsigned int) {
	ar& x.id;
	ar& x.name;
	ar& x.owner;
	ar& x.formula;
}

template<class Archive>
void serialize(Archive& ar, nscalc::TargetElement& x, const unsigned int) {
	ar& x.value;
	ar& x.value_base;
	ar& x.ratio;
}

template<class Archive>
void serialize(Archive& ar, nscalc::Calculation& x, const unsigned int) {
	ar& x.id;
	ar& x.name;
	ar& x.elements;
	ar& x.fertilizers_ids;
	ar& x.volume;
	ar& x.mode;
}
} // namespace boost::serialization

BOOST_CLASS_VERSION(nscalc::Solution, 1);
BOOST_CLASS_VERSION(nscalc::Fertilizer, 30);
BOOST_CLASS_VERSION(nscalc::Calculation, 1);

using Solutions = SerializibleIdVector<nscalc::Solution>;
using Fertilizers = SerializibleIdVector<nscalc::Fertilizer>;
using Calculations = SerializibleIdVector<nscalc::Calculation>;