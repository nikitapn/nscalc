TARGET = linux/bin/npk-calculator
CXX = g++
CXXVER = -std=c++20
CXXFLAGS = $(CXXVER) -Wall -ftemplate-backtrace-limit=0 -O2 -Winvalid-pch -I/usr/local/include

SRCS = $(shell find src/ -name '*.cpp')
OBJS = $(addprefix linux/obj/,$(addsuffix .o, $(basename $(notdir $(SRCS)))))

LIBS_PATH = -L/usr/local/lib
LIBS = \
	-lboost_serialization \
	-lstdc++fs \
	-lpthread \
	-lnprpc \
	-lcrypto \
	-lboost_program_options
	
$(TARGET): $(OBJS) | bin
	$(CXX) $(OBJS) $(LIBS_PATH) $(LIBS) -o $(TARGET)

linux/obj/%.o: src/%.cpp | obj
	$(CXX) $(CXXFLAGS) -c -o $@ $<

bin: 
	mkdir -p linux/bin

obj:
	mkdir -p linux/obj
	
install:
	cp $(TARGET) /usr/local/bin
	
clean:
	rm -rf ./linux/obj
	rm -f $(TARGET)

.PHONY: install clean
