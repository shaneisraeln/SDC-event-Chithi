#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    *returnSize = 0;
    return result;
}
int main() {
    
    int nums[] = {2,7,11,15};
    int returnSize = 0;
    int* result = twoSum(nums, 4, 9, &returnSize);
    printf("[");
    for (int i = 0; i < returnSize; i++) {
        printf("%d", result[i]);
        if (i < returnSize - 1) printf(",");
    }
    printf("]");
    free(result);
    return 0;
}