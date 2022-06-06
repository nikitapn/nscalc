// Copyright (c) 2021 nikitapnn1@gmail.com
// This file is a part of npsystem (Distributed Control System) and covered by LICENSING file in the topmost directory

#pragma once

#include "singleton.hpp"
#include <boost/asio/io_context.hpp>
#include <boost/asio/post.hpp>
#include <boost/asio/use_future.hpp>
#include <boost/thread/thread.hpp>
#include <future>

namespace nplib {

template<size_t NUMBER_OF_THREADS>
class thread_pool : public singleton<thread_pool<NUMBER_OF_THREADS>> {
	friend nplib::singleton<thread_pool<NUMBER_OF_THREADS>>;

	boost::asio::io_context ioc_;
	boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard_;
	boost::thread_group thread_pool_;

	thread_pool() : work_guard_(boost::asio::make_work_guard(ioc_)) {
		for (size_t i = 0; i < NUMBER_OF_THREADS; ++i) {
			thread_pool_.create_thread(
				boost::bind(&boost::asio::io_context::run, &ioc_)
			);
		}
	}
public:
	boost::asio::io_context& ctx() noexcept { return ioc_; }
	void stop() noexcept { 
		ioc_.stop();
		thread_pool_.join_all();
	}
};

using thread_pool_1 = thread_pool<1>;
using thread_pool_2 = thread_pool<2>;
using thread_pool_3 = thread_pool<3>;
using thread_pool_4 = thread_pool<4>;
using thread_pool_5 = thread_pool<5>;
using thread_pool_6 = thread_pool<6>;
using thread_pool_7 = thread_pool<7>;
using thread_pool_8 = thread_pool<8>;

template<bool UseFuture, typename Executor, typename Func, typename... Args>
std::enable_if_t<!UseFuture, void>
async(Executor& ctx, Func&& job, Args&&... args) {
	boost::asio::post(ctx, std::bind(std::forward<Func>(job), std::forward<Args>(args)...));
}

template<bool UseFuture, typename Executor, typename Func, typename... Args>
std::enable_if_t<UseFuture, std::future<std::invoke_result_t<Func, Args...>>>
async(Executor& ctx, Func&& job, Args&&... args) {
	using boost::asio::use_future;
	return boost::asio::post(ctx, use_future(
		std::bind(std::forward<Func>(job), std::forward<Args>(args)...)
	));
}

} // namespace nplib