---
title: "Optimizing image processing in Rust with SIMD intrinsics"
date: "2021-12-04"
---
Single instruction, multiple data (SIMD) intrinsics allow us to vectorize operations that would otherwise occur
sequentially. This can greatly speed up a series of simple, repetitive operations that might be normally 
executed using loops. One place such operations are commonly found is in image processing.

For example, let's say we want to write a function that increases the brightness of an image. We can do that by
simply adding a value to each channel in the image. For simplicity, we assume that our image has already been 
processed into a vector for us. 

No problem - here's that function, which takes in the image as a 
{{<code text="Vec">}} of {{<code text="u8">}}'s and another  {{<code text="u8">}}, which is a value from 0-255 
indicating how much we want to increase the brightness of the image by:

```rust
fn add(input: &Vec<u8>, val: u8) -> Vec<u8> {
    let mut output: Vec<u8> = Vec::with_capacity(input.len());

    for i in input {
        output.push(i + val);
    }

    return output
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
    let val_256 = _mm256_set1_epi8(val as i8);

    let mut i = 0;
    while (i + 32) <= input.len() {
        let chunk = _mm256_loadu_si256(input.as_ptr().offset(i as isize) as *const _);
        let res = _mm256_adds_epi8(chunk, val_256);
        _mm256_storeu_si256(output.as_mut_ptr().offset(i as isize) as *mut _, res);

        i += 32;
    }

    return output
}
```

Let's break this down.

The {{<code text="#[cfg]">}} attribute lets us only compile this function on {{<code text="x86/x86_64">}}, and
the {{<code text="#[target_feature]">}} attribute lets us enable the {{<code text="avx2">}} feature only for this function.

```rust
#[cfg(any(target_arch = "x86", target_arch = "x86_64"))]
#[target_feature(enable = "avx2")]
```

Here we use the relevant {{<link text="arch" href="https://doc.rust-lang.org/core/arch/index.html#">}} module
for our machine.

```rust
#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

#[cfg(target_arch = "x86")]
use std::arch::x86::*;
```

We create our output vector, which should be the same length as our input vector, and populate it with zeroes.

```rust
let mut output: Vec<u8> = vec![0; input.len()];
```

We load {{<code text="val">}} into all 8-bit elements of a 256-bit SIMD register using
{{<link text="_mm256_set1_epi8" href="https://doc.rust-lang.org/core/arch/x86_64/fn._mm256_set1_epi8.html">}}.

```rust
let val_256 = _mm256_set1_epi8(val as i8);
```

Since we are using 256-bit SIMD registers, we can iterate through our input vector 32 bytes at a time, keeping
track of our current position within the vector with a counter variable, {{<code text="i">}}.

Each iteration, we load the next 32 bytes of {{<code text="input">}} into a 256-bit SIMD register using
{{<link text="_mm256_loadu_si256" href="https://doc.rust-lang.org/core/arch/x86_64/fn._mm256_loadu_si256.html">}},
which takes in a pointer to the address of the data.

```rust
let chunk = _mm256_loadu_si256(input.as_ptr().offset(i as isize) as *const _);
```

Then, we add our two SIMD registers together with a single instruction using
{{<link text="_mm256_adds_epi8" href="https://doc.rust-lang.org/core/arch/x86_64/fn._mm256_adds_epi8.html">}}.
We are adding using saturation here, which means that the result will be clamped to fit within an 8-bit integer.

```rust
let res = _mm256_adds_epi8(chunk, val_256);
```

Finally, we store the result using
{{<link text="_mm256_storeu_si256" href="https://doc.rust-lang.org/core/arch/x86_64/fn._mm256_storeu_si256.html">}},
which takes in a pointer to the address of where we want to store the data, and the SIMD register containing the data
we want to store.

```rust
_mm256_storeu_si256(output.as_mut_ptr().offset(i as isize) as *mut _, res);
```

Once we've iterated through the entire input vector, we should have added {{<code text="val">}} to each of its
elements, and produced the correct output vector!

{{< h3 text="Benchmarks" >}}

So how do these two functions actually compare? Let's use 
{{<link text="criterion" href="https://github.com/bheisler/criterion.rs">}} to compare the performance
of the two functions across a range of image sizes.

```rust
fn bench_add(c: &mut Criterion) {
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

```rust
Add 10/No SIMD/1024     time:   [1.9911 us 1.9913 us 1.9916 us]
                        thrpt:  [490.35 MiB/s 490.41 MiB/s 490.47 MiB/s]
Add 10/SIMD/1024        time:   [82.407 ns 82.845 ns 83.485 ns]
                        thrpt:  [11.423 GiB/s 11.512 GiB/s 11.573 GiB/s]
                        
Add 10/No SIMD/16384    time:   [31.677 us 31.680 us 31.683 us]
                        thrpt:  [493.17 MiB/s 493.22 MiB/s 493.26 MiB/s]
Add 10/SIMD/16384       time:   [621.91 ns 622.53 ns 623.34 ns]
                        thrpt:  [24.479 GiB/s 24.511 GiB/s 24.535 GiB/s]
                        
Add 10/No SIMD/32768    time:   [33.592 us 33.598 us 33.605 us]
                        thrpt:  [929.91 MiB/s 930.11 MiB/s 930.27 MiB/s]
Add 10/SIMD/32768       time:   [1.4783 us 1.4792 us 1.4802 us]
                        thrpt:  [20.617 GiB/s 20.631 GiB/s 20.644 GiB/s]
                        
Add 10/No SIMD/65536    time:   [85.862 us 94.245 us 101.66 us]
                        thrpt:  [614.81 MiB/s 663.17 MiB/s 727.91 MiB/s]
Add 10/SIMD/65536       time:   [2.7283 us 2.7311 us 2.7369 us]
                        thrpt:  [22.301 GiB/s 22.348 GiB/s 22.371 GiB/s]
                        
Add 10/No SIMD/131072   time:   [134.03 us 134.03 us 134.04 us]
                        thrpt:  [932.55 MiB/s 932.60 MiB/s 932.65 MiB/s]
Add 10/SIMD/131072      time:   [5.2322 us 5.2328 us 5.2335 us]
                        thrpt:  [23.325 GiB/s 23.328 GiB/s 23.331 GiB/s]                                                                                                                                                                                                
```

And here is a visualization of the timed results. As you can see, the SIMD version is not only significantly faster, 
but also grows at a significantly slower rate as the input size increases.

{{<img src="/images/blog/simd_line_chart.svg" alt="Benchmark line chart" width="900" >}}

{{< h3 text="What about images with an alpha channel?" >}}

Of course, in some cases, we would like to only change the values of particular channels within our image. This could
be because we want to change a certain property of the image that relies on a particular channel, like changing the 
saturation channel in an HSV image, or, more commonly, if we want to change only the RGB channels of RGBA image.

In our case, if our input vector represents an RGBA image, then we would like to add {{<code text="val">}} to all
channels except the 4th channel, which is the alpha channel. This will increase the brightness of the image
while preserving the level of transparency. 

We can use 
{{<link text="_mm256_blendv_epi8" href="https://doc.rust-lang.org/core/arch/x86_64/fn._mm256_blendv_epi8.html">}}
to create a masked SIMD register, which will contain {{<code text="val">}} for the elements corresponding to the RGB
elements in the input, and 0 for the elements corresponding to the alpha channel. This would look something like:
{{<code text="{val, val, val, 0, val, val, val, 0, ...}">}}. 

Since our RGBA image happens to have 4 channels, making each pixel 4 bytes, we can conveniently
fit exactly 8 pixels into each 256-bit SIMD register, allowing us to re-use the same masked SIMD register for each
32-byte chunk.

First, we need a mask. If you take a look at
{{<link text="Intel's documentation" href="https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#text=_mm256_blendv_epi8">}}
for {{<code text="_mm256_blendv_epi8">}}, you'll see that only the highest bit of each 8-bit element needs to be set
in the mask to have an effect on its corresponding element. So, for a 4-byte pixel, the mask would be entirely zeroes
except for the highest bit. Since this value is in two's complement form, with the highest bit representing the sign
bit, the value we pass it should be negative. It turns out that the correct value can be represented as 
{{<code text="-80000000">}} in hex. We'll use this value to generate a mask for all the pixels in the
256-bit register:

```rust
let mask = _mm256_set1_epi32(-0x80000000);
```

Then, we need two registers to "blend". We'll use the {{<code text="val_256">}} register we previously created, and
another register full of zeroes, which we can create with the following:

```rust
let zeroes_256 = _mm256_setzero_si256();
```

Finally, we create the desired masked register:

```rust
let val_masked = _mm256_blendv_epi8(zeroes_256, val_256, mask);
```

And instead of adding {{<code text="val_256">}} to each 32-byte chunk of our input vector, we now add our masked register:

```rust
let res = _mm256_adds_epi8(chunk, val_masked);
```

Voila! Now, we have an optimized way to increase the brightness on both non-alpha and alpha images.

{{< h3 text="Implementation Notes" >}}

{{< h4 text="1. Calling functions that use SIMD intrinsics" >}}

One disadvantage of using SIMD intrinsics is that they are platform-specific. If you are writing functions that
other people may use, you'll want to include a fallback version that will run on all platforms. This can be 
accomplished using the {{<code text="is_x86_feature_detected!">}} macro, which will detect if the specified feature
is supported at runtime. This way, the function will work on any machine, but will use our optimized version
wherever it is supported.

In our case, we can use our initial {{<code text="add">}} implementation as our fallback function.

```rust
fn add_fn(input: &Vec<u8>, val: u8) -> Vec<u8> {
    #[cfg(any(target_arch = "x86", target_arch = "x86_64"))]
    {
        if is_x86_feature_detected!("avx2") {
            return unsafe { add_256(input, val) }
        }
    }

    // Fallback function
    return add(input, val) 
}
```

{{< h4 text="2. Leftover data" >}}

Not all images will be perfectly divisible by 32 bytes. If there are any bytes left over at the end, we can simply
process them sequentially, as there will be no more than 31 bytes to process.

```rust
if i > input.len() {
    for j in (i - 32)..input.len() {
        output[j] = (input[j] + val).clamp(0, 255);
    }
}
```

{{< h3 text="Conclusion" >}}

While a bit verbose, SIMD intrinsics can help you improve the performance of your code.

I hope you found this helpful, and thanks for reading!