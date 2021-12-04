---
title: "Optimizing image processing in Rust with SIMD intrinsics"
date: "2021-12-02"
---
Single instruction, multiple data (SIMD) intrinsics allow us to vectorize operations that would otherwise occur
sequentially. This can greatly speed up

For example, let's say we want to write a function that increases the brightness of an image. We can do that by
simply adding a value to each channel in the image. For simplicity, we assume that our image has already been 
processed into a vector for us. Ok, no problem. Here's that function, which takes in the image as a vector of u8's
and another u8, which is a value from 0-255 indicating how much we want to increase the brightness of the image by:

```rust
fn add(input: &Vec<u8>, val: u8) -> Vec<u8> {
    let mut output: Vec<u8> = Vec::with_capacity(input.len());

    for i in input {
        output.push(i + val);
    }

    output
}
```

Pretty simple, right? Now let's do the same thing again, except this time we'll do it using SIMD intrinsics,
specifically, using AVX2 instructions.

```rust
#[cfg(any(target_arch = "x86", target_arch = "x86_64"))]
#[target_feature(enable = "avx2")]
unsafe fn add_256(input: &Vec<u8>, val: u8) -> Vec<u8> {
    #[cfg(target_arch = "x86_64")]
    use std::arch::x86_64::*;

    #[cfg(target_arch = "x86")]
    use std::arch::x86::*;
    
    let mut output: Vec<u8> = vec![0; input.len()];
    let mut val_256 = _mm256_set1_epi8(val as i8);

    let mut i = 0;
    while (i + 32) <= input.len() {
        let chunk = _mm256_loadu_si256(input.as_ptr().offset(i as isize) as *const _);
        let res = _mm256_adds_epi8(chunk, val_256);
        _mm256_storeu_si256(output.as_mut_ptr().offset(i as isize) as *mut _, res);

        i += 32;
    }

    output
}
```

Let's break this down.

```rust
#[cfg(any(target_arch = "x86", target_arch = "x86_64"))]
#[target_feature(enable = "avx2")]
```

The target_feature attribute will

```rust
#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

#[cfg(target_arch = "x86")]
use std::arch::x86::*;
```

We are using the {{<link text="core::arch" href="https://doc.rust-lang.org/core/arch/index.html#">}} module

{{< subtitle text="Benchmarks" >}}

Here we are using {{<link text="criterion" href="https://github.com/bheisler/criterion.rs">}} to compare the performance
of the two functions across a range of image sizes.

```rust
fn bench_simd(c: &mut Criterion) {
    static KB: usize = 1024;

    let mut group = c.benchmark_group("Add 10");
    for size in [KB, 16 * KB, 32 * KB, 64 * KB, 128 * KB].iter() {
        group.throughput(Throughput::Bytes(*size as u64));
        group.bench_with_input(BenchmarkId::new("No SIMD", size), size, |b, &size| {
            b.iter(|| add(&vec![10; size], 10))
        });
        group.bench_with_input(BenchmarkId::new("SIMD", size), size, |b, &size| {
            b.iter(|| unsafe { add_256(&vec![10; size], 10) })
        });
    }
}
```

Here are the results:

{{<img src="/images/blog/lines.svg" alt="Benchmark line chart" width="800" >}}

{{< subtitle text="What about images with an alpha channel?" >}}

Of course, in some cases, we would like to only change the values of particular channels within our image. This could
be because we want to change a certain property of the image that relies on a particular channel, like changing the 
saturation channel in an HSV image, or, more commonly, if we want to change only the RGB channels of RGBA image.

{{< subtitle text="Implementation Notes" >}}

Not all images will be perfectly divisible by 32 bytes.