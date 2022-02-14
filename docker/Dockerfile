# syntax=docker/dockerfile:1

FROM archlinux

RUN pacman -Syu --noconfirm && pacman -S --noconfirm base-devel boost boost-libs git
RUN pacman -S --noconfirm wget

WORKDIR /root/nprpc_build
RUN git clone https://github.com/nikitapn/nprpc
RUN mkdir -p build/lib build/bin
WORKDIR /root/nprpc_build/nprpc
RUN make && make install

RUN cp -r include/* /usr/local/include

WORKDIR /root
RUN git clone https://github.com/nikitapn/nscalc
WORKDIR /root/nscalc/server
RUN make && make install
RUN chmod +x /usr/local/bin/npk-calculator

WORKDIR /root
RUN wget -c https://github.com/nikitapn/nscalc/releases/download/v1.0.0/nscalc.tar.gz -O - | tar xz

RUN echo "/usr/local/lib" > /etc/ld.so.conf.d/usr-local-lib.conf
RUN ldconfig

EXPOSE 33252

CMD ["/usr/local/bin/npk-calculator", "--root_dir=/root/release/public", "--data_dir=/root/release/data"]


