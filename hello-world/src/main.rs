fn main() {
    println!("Hello, world!");
    let lib = unsafe { libloading::Library::new("libs/library_test.dll").unwrap() };
    let add: libloading::Symbol<fn(usize, usize) -> usize> = unsafe { lib.get(b"add\0").unwrap() };
    println!("Test ffi: 1 + 2 = {}", add(1, 2));
}
