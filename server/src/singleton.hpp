// Copyright (c) 2021 nikitapnn1@gmail.com
// This file is a part of npsystem (Distributed Control System) and covered by LICENSING file in the topmost directory

#ifndef NPLIB_SINGLETON_HPP_
#define NPLIB_SINGLETON_HPP_

#include <memory>
#include <mutex>

namespace nplib {
template<typename T>
class singleton {
	inline static std::once_flag flag_;
	inline static std::unique_ptr<T> instance_;
public:
	static T& get_instance() {
		std::call_once(flag_, []() {
			instance_.reset(new T());
			});
		return *instance_.get();
	}
};
} // namespace nplib

#endif // NPLIB_SINGLETON_HPP_